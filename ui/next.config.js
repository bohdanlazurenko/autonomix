/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3002',
  },
}

module.exports = nextConfig
