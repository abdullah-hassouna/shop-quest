import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  env: {
    DATABASE_POOL_MIN: '5',
    DATABASE_POOL_MAX: '20'
  },
  experimental: {
    optimizeCss: true,
  },
  trailingSlash: false,

  async headers() {
    return [
      {
        source: '/admin/dashboard',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=600',
          },
        ],
      },
    ]
  },

  webpack: (config: any, { isServer }: { isServer: any }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    return config;
  },
};

export default nextConfig;
