/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["i.pinimg.com"],
  },
};

module.exports = nextConfig;
