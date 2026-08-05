import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile in the parent directory otherwise wins root inference.
  turbopack: { root: __dirname },

  experimental: {
    /**
     * Enables React's <ViewTransition>, which the App Router activates on route
     * navigation. Without it the component renders its children and nothing
     * animates — and without browser support the same is true, so every
     * transition on this site degrades to the hard navigation it replaced.
     */
    viewTransition: true,
  },
};

export default nextConfig;
