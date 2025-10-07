/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // Vercel deployment configuration
  output: 'standalone',
}

module.exports = nextConfig
