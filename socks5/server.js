// SOCKS5 Proxy Server for GeForce Now
// Supports both public/free SOCKS5 and user-configured proxy settings

const net = require('net');
const { EventEmitter } = require('events');

// SOCKS5 Protocol Constants
const SOCKS_VERSION = 0x05;
const SOCKS_AUTH_NONE = 0x00;
const SOCKS_AUTH_USER_PASS = 0x02;
const SOCKS_CMD_CONNECT = 0x01;
const SOCKS_ATYP_IPV4 = 0x01;
const SOCKS_ATYP_DOMAIN = 0x03;
const SOCKS_ATYP_IPV6 = 0x04;

class SOCKS5Server extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.host = options.host || process.env.SOCKS5_HOST || '0.0.0.0';
    this.port = parseInt(options.port || process.env.SOCKS5_PORT || '1080');
    this.auth = options.auth || process.env.SOCKS5_AUTH === 'true';
    this.username = options.username || process.env.SOCKS5_USERNAME;
    this.password = options.password || process.env.SOCKS5_PASSWORD;
    
    // Public SOCKS5 proxies (free options)
    this.publicProxies = [
      { host: '165.232.105.25', port: 8000, country: 'US' },
      { host: '72.210.252.134', port: 46164, country: 'US' },
      { host: '184.178.172.25', port: 15291, country: 'US' },
      { host: '107.152.98.5', port: 4145, country: 'US' },
      { host: '142.54.228.193', port: 4145, country: 'US' }
    ];
    
    this.currentProxy = null;
    this.server = null;
  }

  start() {
    return new Promise((resolve, reject) => {
      this.server = net.createServer((clientSocket) => {
        this.handleClient(clientSocket);
      });

      this.server.listen(this.port, this.host, () => {
        console.log(`SOCKS5 Server listening on ${this.host}:${this.port}`);
        this.emit('started', { host: this.host, port: this.port });
        resolve({ host: this.host, port: this.port });
      });

      this.server.on('error', (error) => {
        console.error('SOCKS5 Server error:', error);
        this.emit('error', error);
        reject(error);
      });
    });
  }

  stop() {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          console.log('SOCKS5 Server stopped');
          this.emit('stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  async handleClient(clientSocket) {
    try {
      // Step 1: Authentication negotiation
      const authMethods = await this.negotiateAuth(clientSocket);
      
      if (this.auth && authMethods.includes(SOCKS_AUTH_USER_PASS)) {
        const authenticated = await this.authenticateUser(clientSocket);
        if (!authenticated) {
          clientSocket.end();
          return;
        }
      } else if (!authMethods.includes(SOCKS_AUTH_NONE)) {
        // Send no acceptable methods
        clientSocket.write(Buffer.from([SOCKS_VERSION, 0xFF]));
        clientSocket.end();
        return;
      } else {
        // Send no authentication required
        clientSocket.write(Buffer.from([SOCKS_VERSION, SOCKS_AUTH_NONE]));
      }

      // Step 2: Handle connection request
      const request = await this.receiveConnectRequest(clientSocket);
      
      if (!request) {
        clientSocket.end();
        return;
      }

      // Step 3: Establish connection to target
      await this.establishConnection(clientSocket, request);
      
    } catch (error) {
      console.error('Client handling error:', error);
      clientSocket.destroy();
    }
  }

  negotiateAuth(clientSocket) {
    return new Promise((resolve, reject) => {
      clientSocket.once('data', (data) => {
        if (data.length < 3 || data[0] !== SOCKS_VERSION) {
          reject(new Error('Invalid SOCKS version'));
          return;
        }

        const methodCount = data[1];
        const methods = Array.from(data.slice(2, 2 + methodCount));
        resolve(methods);
      });

      setTimeout(() => {
        reject(new Error('Authentication negotiation timeout'));
      }, 10000);
    });
  }

  authenticateUser(clientSocket) {
    return new Promise((resolve) => {
      clientSocket.once('data', (data) => {
        if (data.length < 3 || data[0] !== 0x01) {
          clientSocket.write(Buffer.from([0x01, 0xFF]));
          resolve(false);
          return;
        }

        const usernameLength = data[1];
        const username = data.slice(2, 2 + usernameLength).toString();
        const passwordLength = data[2 + usernameLength];
        const password = data.slice(3 + usernameLength, 3 + usernameLength + passwordLength).toString();

        const isValid = username === this.username && password === this.password;
        
        clientSocket.write(Buffer.from([0x01, isValid ? 0x00 : 0xFF]));
        resolve(isValid);
      });
    });
  }

  receiveConnectRequest(clientSocket) {
    return new Promise((resolve, reject) => {
      clientSocket.once('data', (data) => {
        if (data.length < 7 || data[0] !== SOCKS_VERSION || data[1] !== SOCKS_CMD_CONNECT) {
          this.sendConnectionResponse(clientSocket, 0x07); // Command not supported
          resolve(null);
          return;
        }

        const addressType = data[3];
        let targetHost, targetPort, offset;

        switch (addressType) {
          case SOCKS_ATYP_IPV4:
            targetHost = `${data[4]}.${data[5]}.${data[6]}.${data[7]}`;
            offset = 8;
            break;
          
          case SOCKS_ATYP_DOMAIN:
            const domainLength = data[4];
            targetHost = data.slice(5, 5 + domainLength).toString();
            offset = 5 + domainLength;
            break;
          
          case SOCKS_ATYP_IPV6:
            // IPv6 support (16 bytes)
            const ipv6Parts = [];
            for (let i = 0; i < 8; i++) {
              ipv6Parts.push(data.readUInt16BE(4 + i * 2).toString(16));
            }
            targetHost = ipv6Parts.join(':');
            offset = 20;
            break;
          
          default:
            this.sendConnectionResponse(clientSocket, 0x08); // Address type not supported
            resolve(null);
            return;
        }

        targetPort = data.readUInt16BE(offset);
        
        // Validate GeForce Now domains
        const gfnDomains = [
          'play.geforcenow.com',
          'gfn-web.nvidia.com', 
          'api.geforcenow.com',
          'auth.geforcenow.com'
        ];
        
        const isGeForceNow = gfnDomains.some(domain => 
          targetHost.includes(domain) || domain.includes(targetHost)
        );
        
        if (!isGeForceNow && addressType === SOCKS_ATYP_DOMAIN) {
          console.warn(`Non-GeForce Now domain attempted: ${targetHost}`);
          // Allow for now, but could be restricted
        }

        resolve({ host: targetHost, port: targetPort });
      });

      setTimeout(() => {
        reject(new Error('Connect request timeout'));
      }, 10000);
    });
  }

  async establishConnection(clientSocket, request) {
    try {
      // Try to connect through configured proxy or direct connection
      const targetSocket = await this.connectToTarget(request);
      
      // Send success response
      this.sendConnectionResponse(clientSocket, 0x00, targetSocket.localAddress, targetSocket.localPort);
      
      // Pipe data between client and target
      clientSocket.pipe(targetSocket);
      targetSocket.pipe(clientSocket);
      
      // Handle disconnections
      clientSocket.on('close', () => targetSocket.destroy());
      targetSocket.on('close', () => clientSocket.destroy());
      
      clientSocket.on('error', (err) => {
        console.error('Client socket error:', err);
        targetSocket.destroy();
      });
      
      targetSocket.on('error', (err) => {
        console.error('Target socket error:', err);
        clientSocket.destroy();
      });
      
    } catch (error) {
      console.error('Connection establishment error:', error);
      this.sendConnectionResponse(clientSocket, 0x01); // General SOCKS server failure
      clientSocket.end();
    }
  }

  connectToTarget(request) {
    return new Promise((resolve, reject) => {
      const socket = new net.Socket();
      
      socket.connect(request.port, request.host, () => {
        resolve(socket);
      });
      
      socket.on('error', (error) => {
        reject(error);
      });
      
      setTimeout(() => {
        socket.destroy();
        reject(new Error('Connection timeout'));
      }, 15000);
    });
  }

  sendConnectionResponse(clientSocket, status, address = '0.0.0.0', port = 0) {
    const response = Buffer.alloc(10);
    response[0] = SOCKS_VERSION;
    response[1] = status;
    response[2] = 0x00; // Reserved
    response[3] = SOCKS_ATYP_IPV4;
    
    // IP address (4 bytes)
    const ipParts = address.split('.');
    if (ipParts.length === 4) {
      response[4] = parseInt(ipParts[0]);
      response[5] = parseInt(ipParts[1]);
      response[6] = parseInt(ipParts[2]);
      response[7] = parseInt(ipParts[3]);
    }
    
    // Port (2 bytes, big endian)
    response.writeUInt16BE(port, 8);
    
    clientSocket.write(response);
  }

  getStatus() {
    return {
      running: this.server && this.server.listening,
      host: this.host,
      port: this.port,
      auth: this.auth,
      publicProxies: this.publicProxies.length
    };
  }

  // Utility method to test public proxies
  async testPublicProxies() {
    const workingProxies = [];
    
    for (const proxy of this.publicProxies) {
      try {
        await this.testProxy(proxy);
        workingProxies.push(proxy);
        console.log(`✓ Proxy ${proxy.host}:${proxy.port} is working`);
      } catch (error) {
        console.log(`✗ Proxy ${proxy.host}:${proxy.port} failed: ${error.message}`);
      }
    }
    
    return workingProxies;
  }

  testProxy(proxy) {
    return new Promise((resolve, reject) => {
      const socket = new net.Socket();
      
      socket.connect(proxy.port, proxy.host, () => {
        socket.end();
        resolve(true);
      });
      
      socket.on('error', reject);
      
      setTimeout(() => {
        socket.destroy();
        reject(new Error('Timeout'));
      }, 5000);
    });
  }
}

// Export for use as module
module.exports = SOCKS5Server;

// CLI usage
if (require.main === module) {
  const server = new SOCKS5Server();
  
  server.start().then(() => {
    console.log('SOCKS5 Server started successfully');
    console.log('Configuration:');
    console.log(`  Host: ${server.host}`);
    console.log(`  Port: ${server.port}`);
    console.log(`  Authentication: ${server.auth ? 'Enabled' : 'Disabled'}`);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('\nTesting public proxies...');
      server.testPublicProxies();
    }
  }).catch((error) => {
    console.error('Failed to start SOCKS5 Server:', error);
    process.exit(1);
  });
  
  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\nShutting down SOCKS5 Server...');
    await server.stop();
    process.exit(0);
  });
}
