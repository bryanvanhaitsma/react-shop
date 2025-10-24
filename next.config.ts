import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'fakestoreapi.com', 
      'cdn.dummyjson.com', 
      'platzi.com', 
      'i.imgur.com',
    ],
  },
};

export default nextConfig;
