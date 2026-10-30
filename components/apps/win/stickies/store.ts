"use client";

import { useSyncExternalStore } from "react";
import { defaultStickies, stickies, type StickyColor } from "@/content/stickies";
import { clamp, desktopSize } from "@/lib/geometry";

export type PlacedSticky = { id: string; x: number; y: number; w: number; h: number; z: number; color: StickyColor };

/** Default sizes: the intro gets the most room. */
const SIZES: Record<string, { w: number; h: number }> = {
  about: { w: 340, h: 360 },
  projects: { w: 320, h: 380 },
  contact: { w: 260, h: 250 },
};
const DEFAULT_SIZE = { w: 300, h: 340 };
const START_X = 372; // clear of the Sticky Notes list window
const GAP = 24;

let placed: PlacedSticky[] | null = null;
const NONE: PlacedSticky[] = [];
let zTop = 0;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());
const doc = (id: string) => stickies.find((s) => s.id === id);

/** Lays the default notes out left to right, wrapping (with an overlap) when the desktop runs out of width. */
function layout(): PlacedSticky[] {
  const desk = desktopSize("windows");
  const x0 = desk.w < 900 ? GAP : START_X;
  let x = x0;
  let y = 32;
  return defaultStickies.flatMap((id) => {
    const d = doc(id);
    if (!d) return [];
    const size = SIZES[id] ?? DEFAULT_SIZE;
    if (x + size.w > desk.w - 16 && x > x0) {
      x = x0 + 40;
      y += 180;
    }
    const s = { id, x, y, ...size, z: ++zTop, color: d.color };
    x += size.w + GAP;
    return [s];
  });
}

function snapshot() {
  return (placed ??= layout());
}

function update(next: PlacedSticky[]) {
  placed = next;
  emit();
}

export const stickyActions = {
  /** Sticks a note to the desktop (or brings it forward), cascading new ones from the top left. */
  open(id: string) {
    const list = snapshot();
    const z = ++zTop;
    if (list.some((s) => s.id === id)) return update(list.map((s) => (s.id === id ? { ...s, z } : s)));
    const d = doc(id);
    if (!d) return;
    const desk = desktopSize("windows");
    const n = list.length;
    const size = SIZES[id] ?? DEFAULT_SIZE;
    const x = clamp(START_X + 40 + n * 28, 0, Math.max(0, desk.w - size.w - 8));
    const y = clamp(48 + n * 28, 0, Math.max(0, desk.h - size.h - 8));
    update([...list, { id, x, y, ...size, z, color: d.color }]);
  },
  close: (id: string) => update(snapshot().filter((s) => s.id !== id)),
  focus(id: string) {
    const list = snapshot();
    if (list.find((s) => s.id === id)?.z === zTop) return;
    const z = ++zTop;
    update(list.map((s) => (s.id === id ? { ...s, z } : s)));
  },
  move: (id: string, x: number, y: number) => update(snapshot().map((s) => (s.id === id ? { ...s, x, y } : s))),
  recolor: (id: string, color: StickyColor) => update(snapshot().map((s) => (s.id === id ? { ...s, color } : s))),
};

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Notes currently stuck on the Windows desktop. In memory only: every visit starts from the defaults. */
export function usePlacedStickies() {
  return useSyncExternalStore(subscribe, snapshot, () => NONE);
}
