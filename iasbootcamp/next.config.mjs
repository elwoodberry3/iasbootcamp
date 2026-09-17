const nextConfig = {
  async rewrites() {
    return [{ source: '/ics/:id.ics', destination: '/ics/:id' }];
  },
};
export default nextConfig;