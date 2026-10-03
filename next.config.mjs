import config from './next-i18next.config.js';
const { i18n } = config;

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  reactStrictMode: true,
  transpilePackages: ['@vercel/analytics'],
  outputFileTracingIncludes: {
    '/*': ['./node_modules/.pnpm/@babel+runtime*/node_modules/@babel/runtime/**/*'],
  },
  i18n,

  images: {
    qualities: [75, 100],
    remotePatterns: [
      { protocol: 'https', hostname: '**.githubusercontent.com' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'http', hostname: 'localhost', port: '1337', pathname: '/uploads/**' },
      { protocol: 'https', hostname: 'pbs.twimg.com' },
      { protocol: 'http', hostname: '127.0.0.1', port: '9000', pathname: '/static/**' },
      { protocol: 'http', hostname: 'localhost', port: '9000', pathname: '/**' },
      { protocol: 'https', hostname: 'medusa-public-images.s3.eu-west-1.amazonaws.com' },
      { protocol: 'https', hostname: 'sbqtqbfkhryqtetytzfi.supabase.co', pathname: '/storage/v1/object/public/medusa-db/**' },
      { protocol: 'https', hostname: 'blogger-production-0439.up.railway.app', pathname: '/uploads/**' },
      {
        protocol: 'https',
        hostname: 'placehold.co', // Cho phép link ảnh ảo
      },
     {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Cấp phép cho ảnh Unsplash
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Cho phép tất cả các đường dẫn từ Cloudinary
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc', // Cho phép avatar từ Pravatar
      },
    ],
  },

  webpack: (config, { isServer }) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
      canvas: "commonjs canvas",
    });

    // FIX LỖI react-dom/server.edge:
    // Ép webpack ưu tiên bản .edge khi chạy trên server Cloudflare
    if (isServer) {
      config.resolve.alias['react-dom/server'] = 'react-dom/server.edge';
    }

    return config;
  },
  
  // Tắt hẳn turbopack để tránh xung đột với alias trên
  turbopack: {} 
};

export default nextConfig;
