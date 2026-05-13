import { getZooApiBase, resolveZooImageUrl } from "./apiBase";

function apiUrl(path) {
  const base = getZooApiBase().replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function withResolvedImages(animal) {
  return { ...animal, image: resolveZooImageUrl(animal.image) };
}

export async function getAnimals() {
  const response = await fetch(apiUrl("/animals"));
  if (!response.ok) {
    throw new Error("Could not load animals.");
  }
  const data = await response.json();
  const list = Array.isArray(data) ? data : data.animals ?? [];
  return list.map(withResolvedImages);
}

export async function createAnimal(payload) {
  const response = await fetch(apiUrl("/animals"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Could not save animal.");
  }

  const saved = await response.json();
  return withResolvedImages(saved);
}
