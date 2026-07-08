import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fgiebrpjsguvsucuugga.supabase.co",
        pathname: "/storage/v1/object/public/palma-images/**",
      },
    ],
  },
};

export default nextConfig;
