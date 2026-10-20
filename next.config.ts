import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: "/store", destination: "https://zizaa.ir/", permanent: false },
      { source: "/:locale/store", destination: "https://zizaa.ir/", permanent: false },
    ];
  },
};

export default nextConfig;
