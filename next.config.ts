import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        hostname: "pub-d4b8eac548004c6f820f1cbb55886fff.r2.dev",
        protocol: "https",
      },
      {
        hostname: "cdn.starlions.dev",
        protocol: "https",
      },
    ],
  },
  output: "standalone",
}

export default nextConfig
