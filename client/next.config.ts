import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

module.exports = {
  images: {
    domains: ['i.ibb.co',
      'res.cloudinary.com'
    ,'raw.githubusercontent.com'], // Add your image hostname here
  },
}
