"use client";

import { ChevronLeft, ChevronRight, Folder, Heart, Images, Info, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { albums, library, type Album } from "@/content/photos";

/** Windows Photos: nav pane, gallery grid and a dark full-window viewer. */
export function PhotosWin() {
  const [album, setAlbum] = useState<Album>(library);
  const [viewing, setViewing] = useState<number | null>(null);
  const last = album.photos.length - 1;

  useEffect(() => {
    if (viewing === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewing(null);
      if (e.key === "ArrowRight") setViewing((v) => (v === null ? v : Math.min(v + 1, last)));
      if (e.key === "ArrowLeft") setViewing((v) => (v === null ? v : Math.max(v - 1, 0)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewing, last]);

  const navItem = (a: Album, label: string, Icon: typeof Images) => (
    <button
      key={a.id}
      type="button"
      onClick={() => {
        setAlbum(a);
        setViewing(null);
      }}
      className={`relative flex w-full items-center gap-3 rounded-md px-3 py-1.5 text-left text-[13px] ${
        a.id === album.id ? "bg-black/5 font-semibold dark:bg-white/8" : "hover:bg-black/4 dark:hover:bg-white/5"
      }`}
    >
      {a.id === album.id && <span className="absolute top-2 bottom-2 left-0 w-0.75 rounded-full bg-[#005fb8] dark:bg-[#60cdff]" />}
      <Icon className="size-4 shrink-0" strokeWidth={1.75} />
      {label}
    </button>
  );

  return (
    <div className="relative flex min-h-0 flex-1 bg-[#f3f3f3] dark:bg-[#202020]">
      <aside className="w-52 shrink-0 space-y-0.5 p-2 @max-xl:hidden">
        {navItem(library, "All photos", Images)}
        <p className="px-3 pt-4 pb-1 text-[12px] font-semibold text-black/55 dark:text-white/55">Albums</p>
        {albums.map((a) => navItem(a, a.name, Folder))}
      </aside>

      <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-tl-lg border-t border-l border-black/6 bg-[#f9f9f9] @max-xl:rounded-none @max-xl:border-l-0 dark:border-white/6 dark:bg-[#272727]">
        <div className="flex shrink-0 items-center gap-3 px-5 pt-4 pb-3">
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[20px] font-semibold">{album.id === "library" ? "Gallery" : album.name}</h1>
            <p className="text-[12px] text-black/55 dark:text-white/55">{album.photos.length} items</p>
          </div>
          <span className="flex h-8 w-52 items-center gap-2 rounded-md border border-black/8 bg-white px-2.5 text-[13px] text-black/50 @max-lg:hidden dark:border-white/8 dark:bg-white/5 dark:text-white/50">
            <Search className="size-3.5" /> Search
          </span>
        </div>
        <div className="os-scroll min-h-0 flex-1 overflow-y-auto px-5 pb-5">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-1">
            {album.photos.map((ph, i) => (
              <button
                key={ph.id}
                type="button"
                aria-label={`Photo ${i + 1}`}
                onClick={() => setViewing(i)}
                className="aspect-square rounded-sm transition-opacity hover:opacity-90"
                style={{ background: ph.background }}
              />
            ))}
          </div>
        </div>
      </section>

      {viewing !== null && (
        <div className="absolute inset-0 z-10 flex flex-col bg-[#1c1c1c] text-white">
          <div className="flex h-11 shrink-0 items-center gap-1 px-3 text-[12px]">
            <span className="flex-1 truncate">Photo {viewing + 1} of {album.photos.length}</span>
            {[Heart, Info, Trash2].map((Icon, i) => (
              <span key={i} className="grid size-8 place-items-center rounded-md hover:bg-white/10" aria-hidden>
                <Icon className="size-4" strokeWidth={1.75} />
              </span>
            ))}
            <button type="button" aria-label="Close" onClick={() => setViewing(null)} className="grid size-8 place-items-center rounded-md hover:bg-white/10">
              <X className="size-4" />
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center p-6">
            <div className="aspect-square h-full max-w-full rounded-sm" style={{ background: album.photos[viewing].background }} />
            {viewing > 0 && (
              <button
                type="button"
                aria-label="Previous photo"
                onClick={() => setViewing(viewing - 1)}
                className="absolute left-3 grid size-9 place-items-center rounded-md bg-black/40 hover:bg-black/60"
              >
                <ChevronLeft className="size-5" />
              </button>
            )}
            {viewing < last && (
              <button
                type="button"
                aria-label="Next photo"
                onClick={() => setViewing(viewing + 1)}
                className="absolute right-3 grid size-9 place-items-center rounded-md bg-black/40 hover:bg-black/60"
              >
                <ChevronRight className="size-5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
