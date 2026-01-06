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
      {
        protocol: 'https',
        hostname: 'vegan-hearts-assets.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/news/**',
      },
      {
        protocol: 'https',
        hostname: 'vegan-hearts-assets.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/india-documentary/**',
      },
    ],
  },
  // Fix workspace root detection warning
  outputFileTracingRoot: require('path').join(__dirname),
}

module.exports = nextConfig
