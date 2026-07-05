import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // Expose NEXT_PUBLIC_API_URL as a runtime-configurable environment variable.
  // In standalone mode, Next.js reads this from the process environment at startup,
  // so the same Docker image works across different deployment targets
  // (local, staging, production) by simply changing the env var — no rebuild needed.
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1",
  },
};

export default nextConfig;
