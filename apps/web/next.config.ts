import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@sabditani/core', '@sabditani/tokens'],
  output: 'export',
  trailingSlash: true,
  devIndicators: false,
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
