"use client";

import { AnimatePresence, motion, useMotionValue } from "motion/react";
import { MoreHorizontal, Plus, X } from "lucide-react";
import { useRef, useState, type PointerEvent } from "react";
import { stickies, type StickyColor } from "@/content/stickies";
import { clamp, type Size } from "@/lib/geometry";
import { ExtLink, RichParagraph } from "../../shared";
import { stickyActions, usePlacedStickies, type PlacedSticky } from "./store";

export const STICKY_COLORS: Record<StickyColor, { bar: string; body: string }> = {
  yellow: { bar: "#fbe58b", body: "#fff7d1" },
  green: { bar: "#c4ebbd", body: "#e4f9e0" },
  pink: { bar: "#ffc6e1", body: "#ffe4f1" },
  purple: { bar: "#dfc9fb", body: "#f2e6ff" },
  blue: { bar: "#c2e2fd", body: "#e2f1ff" },
  gray: { bar: "#dcdcdc", body: "#f3f2f1" },
};

const iconBtn = "grid size-7 place-items-center rounded transition-colors hover:bg-black/8";

function StickyNote({ s, desk, onOpenList }: { s: PlacedSticky; desk: Size; onOpenList: () => void }) {
  const doc = stickies.find((d) => d.id === s.id);
  const [menu, setMenu] = useState(false);
  const x = useMotionValue(s.x);
  const y = useMotionValue(s.y);
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);
  if (!doc) return null;
  const c = STICKY_COLORS[s.color];

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { px: e.clientX, py: e.clientY, x: x.get(), y: y.get() };
  }
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) return;
    x.set(clamp(d.x + e.clientX - d.px, 60 - s.w, desk.w - 60));
    y.set(clamp(d.y + e.clientY - d.py, 0, desk.h - 32));
  }
  function onPointerUp() {
    if (!drag.current) return;
    drag.current = null;
    stickyActions.move(s.id, x.get(), y.get());
  }
  const stop = (e: PointerEvent) => e.stopPropagation();

  return (
    <motion.article
      aria-label={`Sticky note: ${doc.title}`}
      className="pointer-events-auto absolute flex flex-col overflow-hidden rounded-md text-black shadow-[0_8px_28px_rgba(0,0,0,.28),0_0_0_1px_rgba(0,0,0,.06)]"
      style={{ left: x, top: y, width: s.w, height: s.h, zIndex: s.z, background: c.body }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      onPointerDownCapture={() => stickyActions.focus(s.id)}
    >
      <div
        className="flex h-8 shrink-0 cursor-default touch-none items-center px-1"
        style={{ background: c.bar }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <button type="button" aria-label="All notes" onPointerDown={stop} onClick={onOpenList} className={iconBtn}>
          <Plus className="size-4" />
        </button>
        <div className="flex-1" />
        <button type="button" aria-label="Note colour" aria-expanded={menu} onPointerDown={stop} onClick={() => setMenu(!menu)} className={iconBtn}>
          <MoreHorizontal className="size-4" />
        </button>
        <button type="button" aria-label="Close note" onPointerDown={stop} onClick={() => stickyActions.close(s.id)} className={iconBtn}>
          <X className="size-4" />
        </button>
      </div>

      {menu && (
        <div className="grid shrink-0 grid-cols-6 gap-1.5 p-2" style={{ background: c.bar }}>
          {(Object.keys(STICKY_COLORS) as StickyColor[]).map((k) => (
            <button
              key={k}
              type="button"
              aria-label={`${k} note`}
              onClick={() => {
                stickyActions.recolor(s.id, k);
                setMenu(false);
              }}
              className={`h-7 rounded border ${k === s.color ? "border-black/50" : "border-black/10"}`}
              style={{ background: STICKY_COLORS[k].body }}
            />
          ))}
        </div>
      )}

      <div className="os-scroll min-h-0 flex-1 select-text overflow-y-auto px-4 pt-3 pb-4 text-[14px] leading-relaxed">
        <h2 className="mb-2 text-[17px] leading-snug font-semibold">{doc.title}</h2>
        {doc.body.map((p, i) => (
          <RichParagraph key={i} p={p} className="mb-2 [&_a]:font-medium" />
        ))}
        {doc.links && (
          <ul className="mt-1 space-y-0.5">
            {doc.links.map((l) => (
              <li key={l.label}>
                <ExtLink href={l.href} className="font-medium underline underline-offset-2">
                  {l.label}
                </ExtLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.article>
  );
}

/** Notes stuck straight onto the Windows desktop. They sit beneath every app window. */
export function StickyBoard({ desk, onOpenList }: { desk: Size; onOpenList: () => void }) {
  const placed = usePlacedStickies();
  return (
    <div className="pointer-events-none absolute inset-0 isolate z-5">
      <AnimatePresence>
        {placed.map((s) => (
          <StickyNote key={s.id} s={s} desk={desk} onOpenList={onOpenList} />
        ))}
      </AnimatePresence>
    </div>
  );
}
