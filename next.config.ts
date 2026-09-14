import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")

    if (!apiUrl) {
      return []
    }

    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiUrl}/api/v1/:path*`,
      },
    ]
  },
}

export default nextConfig
