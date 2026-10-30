"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Image as ImageIcon, LibraryBig } from "lucide-react";
import { useState, type ReactNode } from "react";
import { albums, type Photo } from "@/content/photos";
import { profile } from "@/content/profile";
import { AScreen, AStack, IconButton } from "../../android/Material";
import { A_STATUS_H } from "../../android/SystemBars";
import { AndroidIcon } from "../../icons/AndroidIcons";
import { Avatar } from "../shared";

type Viewing = { photos: Photo[]; index: number };
type Tab = "Photos" | "Collections";

function Grid({ photos, onView }: { photos: Photo[]; onView: (i: number) => void }) {
  return (
    <div className="grid grid-cols-3 gap-0.5">
      {photos.map((ph, i) => (
        <button key={ph.id} type="button" aria-label={`Photo ${i + 1}`} onClick={() => onView(i)} className="aspect-square" style={{ background: ph.background }} />
      ))}
    </div>
  );
}

/** Material 3 navigation bar: icons with a pill behind the selected one. */
function NavBar({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  const items: { id: Tab; icon: ReactNode }[] = [
    { id: "Photos", icon: <ImageIcon className="size-6" /> },
    { id: "Collections", icon: <LibraryBig className="size-6" /> },
  ];
  return (
    <nav className="flex h-20 shrink-0 justify-center gap-10 bg-(--md-surface-container)">
      {items.map(({ id, icon }) => (
        <button key={id} type="button" aria-current={id === tab ? "page" : undefined} onClick={() => onTab(id)} className="flex w-20 flex-col items-center justify-center gap-1">
          <span
            className={`grid h-8 w-16 place-items-center rounded-full transition-colors ${
              id === tab ? "bg-(--md-secondary-container) text-(--md-on-secondary-container)" : "text-(--md-on-surface-variant)"
            }`}
          >
            {icon}
          </span>
          <span className={`text-[12px] font-medium ${id === tab ? "" : "text-(--md-on-surface-variant)"}`}>{id}</span>
        </button>
      ))}
    </nav>
  );
}

function Viewer({ viewing, onChange, onClose }: { viewing: Viewing; onChange: (i: number) => void; onClose: () => void }) {
  const { photos, index } = viewing;
  const photo = photos[index];
  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center bg-black text-white"
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
          if (info.offset.y > 120 || info.velocity.y > 500) onClose();
          else if (info.offset.x < -80) onChange(Math.min(index + 1, photos.length - 1));
          else if (info.offset.x > 80) onChange(Math.max(index - 1, 0));
        }}
        className="aspect-square w-full touch-none"
        style={{ background: photo.background }}
      />
      <div className="absolute inset-x-0 top-0 flex items-center gap-2 px-1" style={{ paddingTop: A_STATUS_H }}>
        <IconButton label="Back" onClick={onClose}>
          <ArrowLeft className="size-6" />
        </IconButton>
        <span className="text-[14px] tabular-nums opacity-80">
          {index + 1} of {photos.length}
        </span>
      </div>
    </motion.div>
  );
}

/** Google Photos: the library grouped into sections, collections behind the bottom bar, and a swipeable viewer. */
export function PhotosAndroid() {
  const [tab, setTab] = useState<Tab>("Photos");
  const [viewing, setViewing] = useState<Viewing | null>(null);
  const nav = <NavBar tab={tab} onTab={setTab} />;
  const header = (
    <div className="flex h-16 items-center gap-2 pr-2 pl-4">
      <AndroidIcon icon="photos" className="size-7" />
      <h1 className="flex-1 text-[22px]">{tab === "Photos" ? "Google Photos" : "Collections"}</h1>
      <span className="grid size-12 place-items-center">
        <Avatar initials={profile.initials} colors={["#a78bfa", "#6d28d9"]} size={32} />
      </span>
    </div>
  );

  return (
    <>
      <AStack<string | null>
        root={null}
        render={(albumId, stack) => {
          const album = albums.find((a) => a.id === albumId);
          if (album) {
            return (
              <AScreen title={album.name} onBack={stack.pop}>
                <p className="px-4 pb-3 text-[14px] text-(--md-on-surface-variant)">{album.photos.length} items</p>
                <Grid photos={album.photos} onView={(index) => setViewing({ photos: album.photos, index })} />
              </AScreen>
            );
          }
          return (
            <AScreen header={header} bottom={nav} bottomBg="bg-(--md-surface-container)">
              {tab === "Photos" ? (
                albums.map((a) => (
                  <section key={a.id}>
                    <h2 className="px-4 pt-4 pb-2 text-[14px] font-medium">{a.name}</h2>
                    <Grid photos={a.photos} onView={(index) => setViewing({ photos: a.photos, index })} />
                  </section>
                ))
              ) : (
                <div className="grid grid-cols-2 gap-x-3 gap-y-4 px-4 pt-2">
                  {albums.map((a) => (
                    <button key={a.id} type="button" onClick={() => stack.push(a.id)} className="text-left">
                      <span className="block aspect-square rounded-2xl" style={{ background: a.photos[0].background }} />
                      <span className="mt-2 block text-[14px] font-medium">{a.name}</span>
                      <span className="block text-[12px] text-(--md-on-surface-variant)">{a.photos.length} items</span>
                    </button>
                  ))}
                </div>
              )}
            </AScreen>
          );
        }}
      />
      <AnimatePresence>
        {viewing && <Viewer key="viewer" viewing={viewing} onChange={(index) => setViewing({ ...viewing, index })} onClose={() => setViewing(null)} />}
      </AnimatePresence>
    </>
  );
}
