// Placeholder "photos" are CSS gradients. To use real images, give each photo a
// `src` and render it with next/image instead of the gradient tile.
export type Photo = { id: string; background: string };
export type Album = { id: string; name: string; photos: Photo[] };

function tile(seed: number): string {
  const h1 = (seed * 47) % 360;
  const h2 = (h1 + 40 + ((seed * 13) % 60)) % 360;
  const angle = (seed * 67) % 360;
  const gx = 20 + ((seed * 31) % 60);
  const gy = 15 + ((seed * 17) % 50);
  return `radial-gradient(circle at ${gx}% ${gy}%, hsl(${h2} 90% 85% / .75) 0, transparent 45%),
    linear-gradient(${angle}deg, hsl(${h1} 65% 55%), hsl(${h2} 70% 40%))`;
}

function album(id: string, name: string, count: number, offset: number): Album {
  return {
    id,
    name,
    photos: Array.from({ length: count }, (_, i) => ({
      id: `${id}-${i}`,
      background: tile(i + offset),
    })),
  };
}

export const albums: Album[] = [album("life", "Life", 27, 1), album("photoshoots", "Photoshoots", 12, 40)];

export const library: Album = {
  id: "library",
  name: "Library",
  photos: albums.flatMap((a) => a.photos),
};
