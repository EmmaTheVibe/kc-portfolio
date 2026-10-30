"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useState } from "react";
import { albums, library } from "@/content/photos";
import { Segmented } from "../../phone/Grouped";
import { NavScreen } from "../../phone/NavStack";

const allAlbums = [library, ...albums];
const names = allAlbums.map((a) => a.name);

export function PhotosPhone() {
  const [albumName, setAlbumName] = useState(albums[0].name);
  const [viewing, setViewing] = useState<number | null>(null);
  const album = allAlbums.find((a) => a.name === albumName) ?? library;
  const photo = viewing !== null ? album.photos[viewing] : null;

  return (
    <>
      <NavScreen title="Photos" largeTitle plain>
        <div className="px-4 pb-3">
          <Segmented options={names} value={albumName} onChange={setAlbumName} />
          <p className="mt-2 text-[15px] text-black/50 dark:text-white/55">{album.photos.length} Photos</p>
        </div>
        <div className="grid grid-cols-3 gap-0.5">
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
      </NavScreen>

      <AnimatePresence>
        {photo && viewing !== null && (
          <motion.div
            key="viewer"
            className="absolute inset-0 z-40 flex items-center bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              key={photo.id}
              drag
              dragDirectionLock
              dragSnapToOrigin
              onDragEnd={(_, info) => {
                if (info.offset.y > 120 || info.velocity.y > 500) setViewing(null);
                else if (info.offset.x < -80) setViewing(Math.min(viewing + 1, album.photos.length - 1));
                else if (info.offset.x > 80) setViewing(Math.max(viewing - 1, 0));
              }}
              className="aspect-square w-full touch-none"
              style={{ background: photo.background }}
            />
            <div
              className="absolute inset-x-0 top-0 flex items-center justify-between px-4 text-white"
              style={{ paddingTop: "calc(max(env(safe-area-inset-top), 44px) + 8px)" }}
            >
              <span className="text-[15px] tabular-nums opacity-70">
                {viewing + 1} of {album.photos.length}
              </span>
              <button type="button" aria-label="Close" onClick={() => setViewing(null)} className="rounded-full bg-white/15 p-2">
                <X className="size-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
