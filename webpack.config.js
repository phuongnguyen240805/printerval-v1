// Webpack config for external packages in Cloudflare Workers
module.exports = {
  externals: {
    'canvas': 'commonjs canvas',
    'jose': 'commonjs jose',
    '@panva/hkdf': 'commonjs @panva/hkdf',
  },
};
