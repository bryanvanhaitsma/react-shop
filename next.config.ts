import type { NextConfig } from "next";

export const APPROVED_IMAGE_DOMAINS = [
  'api.escuelajs.co',
  'cdn.dummyjson.com', 
  'fakestoreapi.com', 
  'i.imgur.com',
  'i.pravatar.cc',
  'platzi.com', 
  'placehold.co',
  'placeimg.com',
  'www.shutterstock.com',
];

const nextConfig: NextConfig = {
  images: {
    domains: [
      ...APPROVED_IMAGE_DOMAINS,
    ],
  },
};

export default nextConfig;
