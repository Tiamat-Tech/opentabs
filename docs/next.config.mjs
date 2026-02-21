import { withContentCollections } from '@content-collections/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    // docs-v2 lives inside the opentabs monorepo; set the root explicitly
    // so Next.js doesn't walk up to the monorepo root and get confused by
    // its bun.lock when resolving workspace boundaries.
    root: import.meta.dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-5f7cbdfd9ffa4c838e386788f395f0c4.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'cms.retroui.dev',
      },
    ],
  },
};

export default withContentCollections(nextConfig);
