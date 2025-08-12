import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', 
  images: {
    unoptimized: true // needed if using <Image /> in static export
  }
};

export default nextConfig;
