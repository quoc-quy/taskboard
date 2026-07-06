import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // ARCHITECTURE DECISION: Proxy client-side API requests to the backend server via Next.js rewrites.
  // Next.js client-side bundles are compiled at build-time. Attempting to inject NEXT_PUBLIC_ env
  // variables at container runtime will be ignored by the browser. Proxying relative paths (/api/v1/*)
  // to API_URL_SERVER at runtime bypasses build-time variable baking and resolves CORS constraints.
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${process.env.API_URL_SERVER || "http://localhost:3000/api/v1"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
