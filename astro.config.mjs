import { defineConfig } from 'astro/config';

export default defineConfig({
  devToolbar: {
    enabled: false
  },
  // Generate redirects in the built Astro output so they work on static hosts.
  redirects: {
    '/about': {
      status: 301,
      destination: '/company/'
    },
    '/privacy': {
      status: 301,
      destination: 'https://app.punchoutcentral.com/privacy'
    }
  },
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory'
  }
});
