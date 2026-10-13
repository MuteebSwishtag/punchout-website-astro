import { defineConfig } from 'astro/config';

export default defineConfig({
  devToolbar: {
    enabled: false
  },
  // Serve the About alias in Astro dev/preview too; Apache keeps the true
  // production 301 in public/.htaccess.
  redirects: {
    '/about': {
      status: 301,
      destination: '/company/'
    }
  },
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory'
  }
});
