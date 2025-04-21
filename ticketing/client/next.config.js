/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { dev }) {
    if (dev) {
      config.watchOptions = {
        poll: 300,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
