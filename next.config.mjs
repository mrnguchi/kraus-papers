export default {
  // Only non-secret deployment identity is embedded; credentials stay runtime-only.
  env: {
    KRAUS_DEPLOY_CONTEXT: process.env.NETLIFY==='true'?(process.env.CONTEXT||'production'):'local',
    KRAUS_DEPLOY_ORIGIN: process.env.NETLIFY==='true'?(process.env.DEPLOY_PRIME_URL||process.env.URL||''):'',
  },
  poweredByHeader: false,
  outputFileTracingExcludes: { '*': ['./.env*', './storage/**/*', './tests/**/*', './.migration-backup/**/*'] },
  async redirects() {
    return [
      { source: '/:path*', has: [{ type: 'host', value: 'www.krauspapersgmbh.com' }], destination: 'https://krauspapersgmbh.com/:path*', permanent: true },
      { source: '/index.php', destination: '/', permanent: true },
      { source: '/sitemap.php', destination: '/sitemap.xml', permanent: true }
    ];
  },
};
