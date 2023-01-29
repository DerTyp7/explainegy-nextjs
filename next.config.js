/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if your project has type errors.
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "c2.staticflickr.com",
      },
      {
        protocol: "https",
        hostname: "c4.staticflickr.com",
      },
    ],
  },
};

module.exports = nextConfig;
