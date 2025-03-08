/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/tic-tac-toe-two' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/tic-tac-toe-two/' : '',
  transpilePackages: ['next'],
  trailingSlash: true,
}

export default nextConfig