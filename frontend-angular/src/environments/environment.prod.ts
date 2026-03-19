/** See `app/config/api-base.ts` — production on github.io uses Render, not same-origin `/api`. */
export const environment = {
  production: true,
  apiBase: '/api',
  backendTarget: 'node'
};
