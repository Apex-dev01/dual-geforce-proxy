// HTTPS Proxy API for GeForce Now
// Supports Ultraviolet and Scramjet proxy backends

import { NextRequest, NextResponse } from 'next/server';

// Configuration for proxy backends
const PROXY_BACKENDS = {
  ultraviolet: {
    name: 'Ultraviolet',
    endpoint: process.env.ULTRAVIOLET_ENDPOINT || 'https://uv.example.com/service/',
    encodeUrl: (url) => btoa(url),
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  },
  scramjet: {
    name: 'Scramjet',
    endpoint: process.env.SCRAMJET_ENDPOINT || 'https://scramjet.example.com/scramjet/',
    encodeUrl: (url) => encodeURIComponent(url),
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  }
};

// GeForce Now domains that need proxying
const GEFORCE_DOMAINS = [
  'play.geforcenow.com',
  'gfn-web.nvidia.com',
  'api.geforcenow.com',
  'auth.geforcenow.com',
  '*.geforcenow.com'
];

export async function GET(request) {
  return handleProxy(request);
}

export async function POST(request) {
  return handleProxy(request);
}

export async function PUT(request) {
  return handleProxy(request);
}

export async function DELETE(request) {
  return handleProxy(request);
}

async function handleProxy(request) {
  try {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');
    const backend = url.searchParams.get('backend') || 'ultraviolet';
    const proxyType = url.searchParams.get('type') || 'https';

    if (!targetUrl) {
      return NextResponse.json(
        { error: 'Missing target URL parameter' },
        { status: 400 }
      );
    }

    // Validate backend
    if (!PROXY_BACKENDS[backend]) {
      return NextResponse.json(
        { error: `Unsupported backend: ${backend}` },
        { status: 400 }
      );
    }

    // Check if target is GeForce Now domain
    const targetDomain = new URL(targetUrl).hostname;
    const isGeForceNow = GEFORCE_DOMAINS.some(domain => {
      if (domain.startsWith('*.')) {
        return targetDomain.endsWith(domain.slice(2));
      }
      return targetDomain === domain;
    });

    if (!isGeForceNow) {
      return NextResponse.json(
        { error: 'Target URL must be a GeForce Now domain' },
        { status: 403 }
      );
    }

    if (proxyType === 'socks5') {
      // Redirect to SOCKS5 proxy configuration
      return NextResponse.json({
        type: 'socks5',
        message: 'Use SOCKS5 proxy configuration',
        proxy: {
          host: process.env.SOCKS5_HOST || 'localhost',
          port: parseInt(process.env.SOCKS5_PORT || '1080'),
          public: process.env.SOCKS5_PUBLIC === 'true'
        }
      });
    }

    // Handle HTTPS proxy
    const proxyConfig = PROXY_BACKENDS[backend];
    const encodedUrl = proxyConfig.encodeUrl(targetUrl);
    const proxyUrl = `${proxyConfig.endpoint}${encodedUrl}`;

    // Forward the request through the proxy
    const proxyRequest = new Request(proxyUrl, {
      method: request.method,
      headers: {
        ...proxyConfig.headers,
        'X-Forwarded-For': request.headers.get('x-forwarded-for') || 'unknown',
        'Referer': targetUrl
      },
      body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.blob() : undefined
    });

    const response = await fetch(proxyRequest);
    
    // Create response with CORS headers
    const proxyResponse = new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText
    });

    // Copy important headers
    ['content-type', 'content-length', 'cache-control'].forEach(header => {
      const value = response.headers.get(header);
      if (value) {
        proxyResponse.headers.set(header, value);
      }
    });

    // Add CORS headers
    proxyResponse.headers.set('Access-Control-Allow-Origin', '*');
    proxyResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    proxyResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return proxyResponse;

  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Proxy request failed', details: error.message },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Health check endpoint
export async function healthCheck() {
  return NextResponse.json({
    status: 'healthy',
    backends: Object.keys(PROXY_BACKENDS),
    timestamp: new Date().toISOString()
  });
}
