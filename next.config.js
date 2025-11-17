const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,

  // 🚨 Desabilitar ESLint durante build (evita circular structure error)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 🚨 Desabilitar TypeScript strict checking durante build
  typescript: {
    ignoreBuildErrors: true,
  },

  // 🖼️ Otimização de Imagens
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 🗜️ Compressão
  compress: true,

  // 🔒 Segurança - Remover cabeçalho X-Powered-By
  poweredByHeader: false,

  // 📦 Output para Docker/PM2 (standalone)
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,

  // ⚡ Performance - Otimizações experimentais
  experimental: {
    // Otimizar CSS (desabilitado devido a memory issues em Windows)
    // optimizeCss: true,
  },

  // 🔄 Redirects e Rewrites
  async redirects() {
    return [
      // Redirect old URLs if needed
      // { source: '/old-path', destination: '/new-path', permanent: true }
    ];
  },

  // 📝 Headers de segurança (complemento ao middleware)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },

  // 📦 Webpack - Otimizações customizadas
  webpack: (config, { isServer, dev }) => {
    // Ignorar arquivos de documentação
    config.module.rules.push({
      test: /docs\//,
      loader: 'ignore-loader',
    });

    // Otimizar imports de bibliotecas grandes
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
      };
    }

    // Produção: otimizações adicionais
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
      };
    }

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
