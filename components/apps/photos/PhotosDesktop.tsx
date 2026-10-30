"use client";

import { ChevronLeft, ChevronRight, Folder, Images, X } from "lucide-react";
import { useEffect, useState } from "react";
import { albums, library, type Album } from "@/content/photos";

const sections: { label: string; items: Album[] }[] = [
  { label: "Photos", items: [library] },
  { label: "Albums", items: albums },
];

export function PhotosDesktop() {
  const [album, setAlbum] = useState<Album>(albums[0]);
  const [viewing, setViewing] = useState<number | null>(null);

  useEffect(() => {
    if (viewing === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewing(null);
      if (e.key === "ArrowRight") setViewing((v) => (v === null ? v : Math.min(v + 1, album.photos.length - 1)));
      if (e.key === "ArrowLeft") setViewing((v) => (v === null ? v : Math.max(v - 1, 0)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewing, album]);

  return (
    <div className="flex min-h-0 flex-1">
      <aside className="w-[190px] shrink-0 border-r border-black/10 p-2 dark:border-white/10 @max-lg:hidden">
        {sections.map((s) => (
          <div key={s.label}>
            <h3 className="px-2 pt-2 pb-1 text-[11px] font-semibold text-black/40 dark:text-white/40">{s.label}</h3>
            {s.items.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => {
                  setAlbum(a);
                  setViewing(null);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left text-[13px] ${
                  a.id === album.id ? "bg-black/10 dark:bg-white/15" : "hover:bg-black/5 dark:hover:bg-white/10"
                }`}
              >
                {a.id === "library" ? (
                  <Images className="size-4 text-accent" />
                ) : (
                  <Folder className="size-4 text-accent" />
                )}
                {a.name}
              </button>
            ))}
          </div>
        ))}
      </aside>

      <section className="relative flex min-w-0 flex-1 flex-col bg-white dark:bg-[#1e1e1e]">
        <div className="os-scroll min-h-0 flex-1 overflow-y-auto p-4">
          <h1 className="text-[20px] font-bold">{album.name}</h1>
          <p className="mb-3 text-[12px] text-black/45 dark:text-white/45">{album.photos.length} Photos</p>
          <div className="grid grid-cols-5 gap-0.5 @max-2xl:grid-cols-4 @max-lg:grid-cols-3">
            {album.photos.map((ph, i) => (
              <button
                key={ph.id}
                type="button"
                aria-label={`Photo ${i + 1}`}
                onClick={() => setViewing(i)}
                className="aspect-square"
                style={{ background: ph.background }}
              />
            ))}
          </div>
        </div>

        {viewing !== null && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/90" onClick={() => setViewing(null)}>
            <div
              className="aspect-square h-[80%] max-w-[80%] rounded-md"
              style={{ background: album.photos[viewing].background }}
              onClick={(e) => e.stopPropagation()}
            />
            <button type="button" aria-label="Close" className="absolute right-3 top-3 rounded-full bg-white/15 p-1.5 text-white">
              <X className="size-4" />
            </button>
            {viewing > 0 && (
              <button
                type="button"
                aria-label="Previous photo"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewing(viewing - 1);
                }}
                className="absolute left-3 rounded-full bg-white/15 p-1.5 text-white"
              >
                <ChevronLeft className="size-4" />
              </button>
            )}
            {viewing < album.photos.length - 1 && (
              <button
                type="button"
                aria-label="Next photo"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewing(viewing + 1);
                }}
                className="absolute right-3 rounded-full bg-white/15 p-1.5 text-white"
              >
                <ChevronRight className="size-4" />
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
