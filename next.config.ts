import type { NextConfig } from "next";

const basePath = process.env.BASE_PATH || ""; // Set by CI for GitHub Pages

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
};

export default nextConfig;
