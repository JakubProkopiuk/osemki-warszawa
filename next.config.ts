import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/[slug]': ['./data/locations.json', './src/data/locations.json'],
  },
};

export default nextConfig;
