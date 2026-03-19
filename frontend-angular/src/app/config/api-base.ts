/**
 * Where the browser should call the animals API.
 *
 * - Local `ng serve`: `/api` → dev proxy → localhost:3000
 * - GitHub Pages: absolute Render URL (same idea as legacy components/config.js)
 * - Node/Express serving the SPA from the same host: `/api` on that origin
 */
const RENDER_API_BASE = 'https://jlzoo.onrender.com/api';

export function getZooApiBase(): string {
  if (typeof window === 'undefined' || !window.location) {
    return '/api';
  }

  const host = window.location.hostname;

  if (host === 'localhost' || host === '127.0.0.1') {
    return '/api';
  }

  if (host.endsWith('github.io')) {
    return RENDER_API_BASE;
  }

  return '/api';
}

/** Turn API image fields into a URL the browser can load. */
export function resolveZooImageUrl(imagePath: string): string {
  const trimmed = (imagePath ?? '').trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  // Keep relative asset paths relative to the app's base href (/JLZoo/ on GitHub Pages).
  return trimmed.replace(/^\/+/, '');
}
