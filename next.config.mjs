/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // /blog and /api-docs were removed entirely (deleted, not just unlinked,
    // so Google stops indexing them). Anyone or anything still holding an
    // old link, external backlinks, cached search results, bookmarks, gets
    // sent to the homepage instead of hitting a dead end.
    return [
      {
        source: "/blog",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blog/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/api-docs",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
