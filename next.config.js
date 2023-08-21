/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // config.devtool = 'source-map';
    // config.devtool = 'eval-cheap-module-source-map';
    return config
  },
}

module.exports = nextConfig
