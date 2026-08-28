import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite/Prisma phải chạy native Node — tránh Turbopack bundle (lỗi path URL)
  serverExternalPackages: [
    "unpdf",
    "@napi-rs/canvas",
    "pdfjs-dist",
    "@electric-sql/pglite",
    "pglite-prisma-adapter",
    "@prisma/adapter-pg",
    "@prisma/client",
    "pg",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.vietqr.io",
        pathname: "/image/**",
      },
    ],
  },
};

export default nextConfig;
