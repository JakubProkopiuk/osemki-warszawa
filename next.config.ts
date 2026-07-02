import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/[slug]': ['./data/locations.json', './src/data/locations.json'],
  },
  async redirects() {
    return [
      {
        source: '/ochota',
        destination: '/ursynow',
        permanent: true,
      },
      {
        source: '/ul-:slug',
        destination: '/ursynow',
        permanent: true,
      },
      {
        source: '/ulica-:slug',
        destination: '/ursynow',
        permanent: true,
      },
      {
        source: '/osiedle-:slug',
        destination: '/ursynow',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
