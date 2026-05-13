/**
 * Base URL for the Zoo.Api JSON API (no trailing slash).
 *
 * - Local `npm run dev` / `preview`: `/api` → Vite proxy → ASP.NET Core `Zoo.Api` (default http://localhost:3000)
 * - Static hosting (Infinity Free, GitHub Pages, etc.): set `VITE_ZOO_API_BASE` at build time to your
 *   deployed API root, e.g. `https://your-api-host/api` (must include `/api` because controllers use `api/[controller]`)
 */
export function getZooApiBase() {
  const envBase = import.meta.env.VITE_ZOO_API_BASE;
  if (typeof envBase === "string" && envBase.trim()) {
    return envBase.trim();
  }

  return "/api";
}

export function resolveZooImageUrl(imagePath) {
  const trimmed = (imagePath ?? "").trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return trimmed.replace(/^\/+/, "");
}
