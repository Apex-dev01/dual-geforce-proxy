# Dual GeForce Now Proxy

A comprehensive dual-proxy solution for GeForce Now with support for both HTTPS (Ultraviolet/Scramjet) and SOCKS5 proxy configurations. Deploy easily on Vercel with automatic proxy switching capabilities.

## 🚀 Features

- **Dual Proxy Support**: Switch between HTTPS and SOCKS5 proxy methods
- **HTTPS Proxy**: Ultraviolet and Scramjet backend support
- **SOCKS5 Proxy**: Full SOCKS5 server implementation with public proxy options
- **GeForce Now Optimized**: Domain validation and traffic optimization
- **Vercel Ready**: One-click deployment with environment configuration
- **Frontend Interface**: React-based control panel for proxy switching
- **Auto-Configuration**: Environment-based setup with sensible defaults

## 📁 Project Structure

```
dual-geforce-proxy/
├── api/                    # HTTPS Proxy API
│   └── index.js           # Main proxy endpoint
├── frontend/              # Next.js React frontend
│   ├── components/        # UI components
│   └── pages/            # Next.js pages
├── socks5/               # SOCKS5 Proxy Server
│   ├── server.js         # SOCKS5 implementation
│   └── package.json      # Dependencies
├── README.md             # This file
└── VERCEL_DEPLOYMENT.md  # Deployment guide
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 14+ (for SOCKS5 server)
- Vercel account (for deployment)
- GeForce Now account

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Apex-dev01/dual-geforce-proxy.git
   cd dual-geforce-proxy
   ```

2. **Install dependencies**
   ```bash
   # Frontend dependencies
   cd frontend
   npm install
   
   # SOCKS5 server dependencies  
   cd ../socks5
   npm install
   ```

3. **Environment Configuration**
   Create `.env.local` in the root directory:
   ```env
   # HTTPS Proxy Configuration
   ULTRAVIOLET_ENDPOINT=https://uv.example.com/service/
   SCRAMJET_ENDPOINT=https://scramjet.example.com/scramjet/
   
   # SOCKS5 Proxy Configuration
   SOCKS5_HOST=0.0.0.0
   SOCKS5_PORT=1080
   SOCKS5_AUTH=false
   SOCKS5_USERNAME=
   SOCKS5_PASSWORD=
   SOCKS5_PUBLIC=true
   ```

4. **Start Development Servers**
   ```bash
   # Start frontend (Terminal 1)
   cd frontend
   npm run dev
   
   # Start SOCKS5 server (Terminal 2)
   cd socks5
   npm run dev
   ```

## 🔧 Configuration

### HTTPS Proxy Backends

The API supports multiple HTTPS proxy backends:

#### Ultraviolet
- **Endpoint**: Configurable via `ULTRAVIOLET_ENDPOINT`
- **Encoding**: Base64 URL encoding
- **Best for**: General web browsing proxy

#### Scramjet
- **Endpoint**: Configurable via `SCRAMJET_ENDPOINT` 
- **Encoding**: URL parameter encoding
- **Best for**: Advanced proxy features

### SOCKS5 Proxy Configuration

#### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SOCKS5_HOST` | `0.0.0.0` | Server bind address |
| `SOCKS5_PORT` | `1080` | Server port |
| `SOCKS5_AUTH` | `false` | Enable authentication |
| `SOCKS5_USERNAME` | - | Auth username |
| `SOCKS5_PASSWORD` | - | Auth password |
| `SOCKS5_PUBLIC` | `true` | Use public proxy list |

#### Public Proxy List

The SOCKS5 server includes built-in public proxies:
- US-based free SOCKS5 proxies
- Automatic proxy testing and validation
- Fallback options for reliability

## 🚀 API Usage

### HTTPS Proxy Endpoint

```javascript
// Basic proxy request
fetch('/api?url=https://play.geforcenow.com&backend=ultraviolet')

// With Scramjet backend
fetch('/api?url=https://gfn-web.nvidia.com&backend=scramjet')

// Request SOCKS5 configuration
fetch('/api?type=socks5')
```

### Response Format

#### Success (HTTPS)
```json
{
  "status": 200,
  "data": "[proxied content]"
}
```

#### SOCKS5 Configuration
```json
{
  "type": "socks5",
  "message": "Use SOCKS5 proxy configuration",
  "proxy": {
    "host": "localhost",
    "port": 1080,
    "public": true
  }
}
```

## 🎮 GeForce Now Integration

### Supported Domains

The proxy validates and optimizes traffic for:
- `play.geforcenow.com`
- `gfn-web.nvidia.com`
- `api.geforcenow.com`
- `auth.geforcenow.com`
- `*.geforcenow.com`

### Proxy Switching Logic

The frontend automatically:
1. Detects GeForce Now traffic
2. Tests proxy connectivity
3. Switches between HTTPS and SOCKS5 based on performance
4. Provides manual override options

## 🔒 Security Features

- **Domain Validation**: Only GeForce Now domains allowed
- **CORS Protection**: Proper headers for web security
- **Rate Limiting**: Built-in connection limits
- **Error Handling**: Comprehensive error responses
- **Authentication**: Optional SOCKS5 user/pass auth

## 📊 Monitoring & Testing

### Health Check
```bash
# Check API status
curl https://your-deployment.vercel.app/api

# Test SOCKS5 server
cd socks5
npm run test-proxies
```

### Logs & Debugging

- **Vercel Logs**: Available in Vercel dashboard
- **SOCKS5 Logs**: Console output with connection details
- **Error Tracking**: Detailed error messages and stack traces

## 🌐 Deployment

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Apex-dev01/dual-geforce-proxy)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This tool is for educational and testing purposes. Ensure compliance with:
- GeForce Now Terms of Service
- Local network policies
- Applicable laws and regulations

## 🆘 Troubleshooting

### Common Issues

#### SOCKS5 Connection Refused
```bash
# Check if server is running
ps aux | grep node

# Restart server
cd socks5
npm restart
```

#### Proxy Backend Errors
- Verify `ULTRAVIOLET_ENDPOINT` and `SCRAMJET_ENDPOINT` URLs
- Check backend service availability
- Review Vercel function logs

#### GeForce Now Connection Issues
- Ensure domain validation is working
- Test direct connection first
- Check browser console for errors

### Support

For issues and feature requests:
- [GitHub Issues](https://github.com/Apex-dev01/dual-geforce-proxy/issues)
- [Discussions](https://github.com/Apex-dev01/dual-geforce-proxy/discussions)

---

**Made with ❤️ for the GeForce Now community**
