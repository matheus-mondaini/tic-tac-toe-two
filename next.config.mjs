/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/tictactoe-game' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/tictactoe-game' : '',
}

export default nextConfig;