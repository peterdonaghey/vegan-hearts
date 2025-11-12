/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to support API routes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vegan-hearts-assets.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/events/**',
      },
    ],
  },
}

module.exports = nextConfig
