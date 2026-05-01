/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Ignore TS build errors in CI (type-check runs separately)
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

module.exports = nextConfig
