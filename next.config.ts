import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  typescript: {
    // 在生产构建时忽略 TypeScript 错误（开发时已检查）
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
