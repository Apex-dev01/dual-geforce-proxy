# 🚀 Vercel Deployment Guide

## Quick Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Node.js 16.x or higher (for local development)

### 🎯 One-Click Deployment

**Option 1: Direct GitHub Integration**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import this GitHub repository: `Apex-dev01/dual-geforce-proxy`
3. **Configure Project Settings:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend/`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

**Option 2: Vercel CLI**
```bash
# Install Vercel CLI globally
npm i -g vercel

# Navigate to the frontend directory
cd frontend/

# Deploy to Vercel
vercel

# Follow the prompts:
# - Set up and deploy? [Y/n] Y
# - Which scope? (select your account)
# - Link to existing project? [y/N] N
# - What's your project's name? dual-geforce-proxy
# - In which directory is your code located? ./
```

### 📋 Project Structure

```
dual-geforce-proxy/
├── frontend/                   # Next.js Application
│   ├── app/
│   │   ├── globals.css        # Tailwind CSS styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Dashboard page
│   ├── next.config.js         # Next.js configuration
│   ├── package.json           # Dependencies
│   ├── tailwind.config.js     # Tailwind CSS config
│   ├── tsconfig.json          # TypeScript config
│   └── postcss.config.js      # PostCSS config
├── README.md
├── .gitignore
└── VERCEL_DEPLOYMENT.md       # This file
```

### ⚙️ Configuration Details

**Vercel Project Settings:**
- **Build & Development Settings:**
  - Framework Preset: `Next.js`
  - Root Directory: `frontend/`
  - Build Command: `npm run build`
  - Output Directory: `.next` (auto-detected)
  - Install Command: `npm install`
  - Development Command: `npm run dev`

**Environment Variables:**
- No environment variables required for basic setup
- Add any proxy configurations as needed in Vercel dashboard

### 🎨 Dashboard Features

The deployed dashboard includes:

✅ **Welcome Screen** - Professional landing interface  
✅ **Proxy Type Toggle** - Switch between HTTPS ↔ SOCKS5  
✅ **Configuration Fields:**  
- **HTTPS Mode:** Ultraviolet URL, Scramjet URL
- **SOCKS5 Mode:** Host, Port settings

✅ **Real-time Configuration Display**  
✅ **Modern UI** with Tailwind CSS styling  
✅ **TypeScript Support** for better development experience  
✅ **Responsive Design** for all devices  

### 🔧 Local Development

```bash
# Clone the repository
git clone https://github.com/Apex-dev01/dual-geforce-proxy.git
cd dual-geforce-proxy/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### 📦 Dependencies

**Core Framework:**
- Next.js 14.0.3
- React 18
- TypeScript 5

**Styling:**
- Tailwind CSS 3.3.0
- PostCSS
- Autoprefixer

### 🚨 Troubleshooting

**Build Errors:**
- Ensure Node.js version is 16.x or higher
- Clear cache: `rm -rf .next node_modules package-lock.json && npm install`
- Check that all TypeScript files are properly typed

**Deployment Issues:**
- Verify the root directory is set to `frontend/`
- Check that all configuration files are present
- Ensure build command is `npm run build`

**Runtime Issues:**
- Check browser console for JavaScript errors
- Verify Tailwind CSS is loading properly
- Ensure all imports are correct

### 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### 💡 Production Optimizations

The application is pre-configured with:
- ⚡ Next.js App Router for better performance
- 🎨 Tailwind CSS for optimized styling
- 📱 Responsive design for all devices
- 🛡️ TypeScript for type safety
- 🔄 Automatic code splitting
- 📊 Built-in analytics support

---

**🎉 That's it! Your proxy dashboard should be live on Vercel!**

*Access your deployed application at the Vercel-provided URL (e.g., `your-project.vercel.app`)*
