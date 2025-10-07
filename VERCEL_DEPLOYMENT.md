# 🚀 Vercel Deployment Guide

Complete deployment guide for the Dual GeForce Now Proxy system with HTTPS and SOCKS5 proxy support.

## 🎯 Quick Deploy to Vercel

### Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Node.js 16.x or higher (for local development and SOCKS5 server)
- GeForce Now account for testing

### 📋 Architecture Overview

This deployment includes:

```
dual-geforce-proxy/
├── api/                       # Vercel API Routes (HTTPS Proxy)
│   └── index.js              # Main proxy endpoint
├── frontend/                  # Next.js Application
│   ├── app/                  # App Router pages
│   ├── components/           # React components
│   └── lib/                  # Utility functions
├── socks5/                   # SOCKS5 Proxy Server
│   ├── server.js            # SOCKS5 implementation
│   └── package.json         # Server dependencies
└── docs/                     # Documentation
```

## 🚀 Deployment Methods

### Option 1: One-Click Deploy (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Apex-dev01/dual-geforce-proxy)

1. Click the deploy button above
2. Connect your GitHub account
3. Configure environment variables (see below)
4. Deploy!

### Option 2: Manual GitHub Import

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"

2. **Import Repository**
   - Enter: `https://github.com/Apex-dev01/dual-geforce-proxy`
   - Or connect your GitHub and select the repository

3. **Configure Project Settings**
   ```
   Framework Preset: Next.js
   Root Directory: frontend/
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   Node.js Version: 18.x (recommended)
   ```

### Option 3: Vercel CLI Deployment

```bash
# Install Vercel CLI globally
npm i -g vercel

# Clone the repository
git clone https://github.com/Apex-dev01/dual-geforce-proxy.git
cd dual-geforce-proxy

# Deploy frontend
cd frontend
vercel

# Follow prompts:
# - Set up and deploy? [Y/n] Y
# - Which scope? (select your account)
# - Link to existing project? [y/N] N
# - What's your project's name? dual-geforce-proxy
# - In which directory is your code located? ./
```

## ⚙️ Environment Configuration

### Required Environment Variables

Configure these in your Vercel project settings:

```env
# HTTPS Proxy Backends
ULTRAVIOLET_ENDPOINT=https://uv.example.com/service/
SCRAMJET_ENDPOINT=https://scramjet.example.com/scramjet/

# SOCKS5 Proxy Configuration
SOCKS5_HOST=0.0.0.0
SOCKS5_PORT=1080
SOCKS5_AUTH=false
SOCKS5_USERNAME=
SOCKS5_PASSWORD=
SOCKS5_PUBLIC=true

# Optional: Custom Configuration
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-deployment.vercel.app
```

### Setting Environment Variables

1. **Via Vercel Dashboard**
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add each variable with appropriate values

2. **Via Vercel CLI**
   ```bash
   vercel env add ULTRAVIOLET_ENDPOINT
   vercel env add SCRAMJET_ENDPOINT
   vercel env add SOCKS5_HOST
   vercel env add SOCKS5_PORT
   # ... add other variables
   ```

## 🛠️ API Endpoints Setup

### Vercel API Routes

The `/api` folder is automatically deployed as Vercel serverless functions:

- **Main Proxy**: `https://your-app.vercel.app/api`
- **Health Check**: `https://your-app.vercel.app/api?healthcheck=true`

### API Usage Examples

```javascript
// HTTPS Proxy Request
const response = await fetch('/api?url=https://play.geforcenow.com&backend=ultraviolet');

// SOCKS5 Configuration Request
const socks5Config = await fetch('/api?type=socks5');
```

## 🖥️ SOCKS5 Server Deployment

### Separate VPS Deployment (Recommended)

For optimal performance, deploy the SOCKS5 server on a separate VPS:

1. **DigitalOcean, AWS EC2, or similar**
   ```bash
   # SSH into your VPS
   git clone https://github.com/Apex-dev01/dual-geforce-proxy.git
   cd dual-geforce-proxy/socks5
   
   # Install dependencies
   npm install
   
   # Configure environment
   cp .env.example .env
   nano .env
   
   # Start server with PM2 (recommended)
   npm install -g pm2
   pm2 start server.js --name "socks5-proxy"
   pm2 startup
   pm2 save
   ```

2. **Update Vercel Environment**
   ```env
   SOCKS5_HOST=your-vps-ip
   SOCKS5_PORT=1080
   ```

### Local SOCKS5 Server

For development or testing:

```bash
cd socks5
npm install
npm start

# Server will start on localhost:1080
```

## 🔧 Advanced Configuration

### Custom Domain Setup

1. **Add Domain in Vercel**
   - Go to project settings
   - Navigate to "Domains"
   - Add your custom domain

2. **DNS Configuration**
   ```
   Type: CNAME
   Name: your-subdomain (or @)
   Value: cname.vercel-dns.com
   ```

### SSL/TLS Configuration

Vercel automatically provides SSL certificates for:
- All `.vercel.app` domains
- Custom domains (with automatic renewal)

### Performance Optimization

```javascript
// next.config.js optimization
module.exports = {
  experimental: {
    runtime: 'edge', // For API routes
  },
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 's-maxage=60, stale-while-revalidate' },
        { key: 'Access-Control-Allow-Origin', value: '*' },
      ],
    },
  ],
};
```

## 📊 Monitoring & Analytics

### Vercel Analytics Setup

1. **Enable Analytics**
   ```bash
   npm install @vercel/analytics
   ```

2. **Add to Layout**
   ```javascript
   import { Analytics } from '@vercel/analytics/react';
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

### Function Logs

- View real-time logs in Vercel dashboard
- Monitor API performance and errors
- Set up alerts for critical issues

## 🧪 Testing Deployment

### Frontend Testing

```bash
# Test homepage
curl https://your-app.vercel.app

# Test API endpoint
curl "https://your-app.vercel.app/api?healthcheck=true"
```

### SOCKS5 Testing

```bash
# Test SOCKS5 connectivity (from local machine)
cd socks5
npm run test-proxies

# Test with curl (if SOCKS5 server accessible)
curl --socks5 your-vps-ip:1080 https://play.geforcenow.com
```

### GeForce Now Integration

1. **Open GeForce Now**
2. **Configure Proxy Settings**
   - For HTTPS: Use your Vercel app URL
   - For SOCKS5: Use your VPS IP and port
3. **Test Connection**
   - Monitor network traffic
   - Verify proxy routing

## 🚨 Troubleshooting

### Common Deployment Issues

#### Build Failures

```bash
# Check build logs in Vercel dashboard
# Common fixes:

# 1. Update Node.js version
# In package.json:
"engines": {
  "node": ">=18.0.0"
}

# 2. Clear cache and redeploy
vercel --prod --force
```

#### API Route Errors

```javascript
// Check API logs for:
// - Missing environment variables
// - Network connectivity issues
// - Rate limiting

// Add error logging:
console.error('API Error:', error);
return NextResponse.json(
  { error: 'Internal server error', details: error.message },
  { status: 500 }
);
```

#### SOCKS5 Connection Issues

```bash
# Check server status
sudo netstat -tlnp | grep :1080

# Check firewall settings
sudo ufw allow 1080

# Restart service
pm2 restart socks5-proxy
```

### Performance Issues

1. **Enable Caching**
   ```javascript
   // In API routes
   response.headers.set('Cache-Control', 's-maxage=60');
   ```

2. **Optimize Bundle Size**
   ```bash
   npm install --save-dev webpack-bundle-analyzer
   npm run analyze
   ```

3. **Monitor Function Duration**
   - Check Vercel function logs
   - Optimize slow operations
   - Consider edge runtime for faster cold starts

## 🔄 Updates & Maintenance

### Automatic Deployments

Vercel automatically deploys when you:
- Push to the main branch
- Merge pull requests
- Update environment variables

### Manual Redeployment

```bash
# Force redeploy with CLI
vercel --prod --force

# Or trigger via webhook
curl -X POST "https://api.vercel.com/v1/integrations/deploy/YOUR_HOOK_ID"
```

### Monitoring Updates

1. **Enable GitHub Actions**
   ```yaml
   # .github/workflows/test.yml
   name: Test and Deploy
   on: [push, pull_request]
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
         - run: npm test
   ```

2. **Set Up Alerts**
   - Vercel deployment notifications
   - Error tracking with Sentry
   - Uptime monitoring with UptimeRobot

## 📋 Deployment Checklist

- [ ] Repository cloned and configured
- [ ] Environment variables set in Vercel
- [ ] Frontend deployed successfully
- [ ] API endpoints responding
- [ ] SOCKS5 server deployed (if using VPS)
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] GeForce Now integration tested
- [ ] Monitoring and alerts configured
- [ ] Documentation updated

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [GitHub Repository](https://github.com/Apex-dev01/dual-geforce-proxy)
- [Issue Tracker](https://github.com/Apex-dev01/dual-geforce-proxy/issues)

## 💡 Pro Tips

1. **Use Preview Deployments** for testing changes
2. **Enable Branch Protection** for production stability
3. **Monitor Function Usage** to avoid limits
4. **Implement Rate Limiting** for API protection
5. **Use Environment-specific Configs** for different stages
6. **Keep Dependencies Updated** for security
7. **Document Environment Variables** for team collaboration

---

**Need help?** Create an issue in the [GitHub repository](https://github.com/Apex-dev01/dual-geforce-proxy/issues) or check the [discussions](https://github.com/Apex-dev01/dual-geforce-proxy/discussions) for community support.
