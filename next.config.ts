import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['knex'],
  // experimental: {
  //   serverComponentsExternalPackages: ['knex'],
  // }
};

export default nextConfig;
