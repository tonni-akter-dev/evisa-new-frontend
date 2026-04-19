import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // // 👇 Force webpack mode (fixes your error)
  // turbopack: false,

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default nextConfig;