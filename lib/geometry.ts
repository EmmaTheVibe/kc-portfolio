export type Geom = { x: number; y: number; w: number; h: number };
export type Size = { w: number; h: number };

export const MENUBAR_H = 28;
export const TASKBAR_H = 48;

export const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** The area windows live in: below the macOS menu bar (the Dock floats over it), or above the Windows taskbar. */
export function desktopSize(skin: "macos" | "windows" = "macos"): Size {
  return { w: window.innerWidth, h: window.innerHeight - (skin === "windows" ? TASKBAR_H : MENUBAR_H) };
}

/** Min sizes never exceed the desktop minus a 16px margin. */
export function effectiveMin(min: Size, desk: Size): Size {
  return { w: Math.min(min.w, desk.w - 16), h: Math.min(min.h, desk.h - 16) };
}

/** Keeps at least 100px of the window and its titlebar on screen. */
export function clampPosition(x: number, y: number, w: number, desk: Size) {
  return { x: clamp(x, 100 - w, desk.w - 100), y: clamp(y, 0, desk.h - 40) };
}

export function clampGeom(g: Geom, min: Size, desk: Size): Geom {
  const m = effectiveMin(min, desk);
  const w = clamp(g.w, m.w, desk.w);
  const h = clamp(g.h, m.h, desk.h);
  return { w, h, ...clampPosition(g.x, g.y, w, desk) };
}

export function sameGeom(a: Geom, b: Geom) {
  return a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;
}
