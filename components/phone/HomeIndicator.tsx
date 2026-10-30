"use client";

import { useRef, type PointerEvent } from "react";

type Props = {
  /** Called continuously with the upward drag distance (≤ 0). */
  onDrag: (dy: number) => void;
  /** `close` is true for a tap or a swipe past the threshold. */
  onRelease: (close: boolean) => void;
};

/** Home bar plus the bottom gesture zone: swipe up or tap to go home. */
export function HomeIndicator({ onDrag, onRelease }: Props) {
  const g = useRef<{ y0: number; lastY: number; lastT: number; v: number } | null>(null);

  function down(e: PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    g.current = { y0: e.clientY, lastY: e.clientY, lastT: e.timeStamp, v: 0 };
  }

  function move(e: PointerEvent<HTMLDivElement>) {
    const s = g.current;
    if (!s) return;
    const dt = e.timeStamp - s.lastT;
    if (dt > 0) s.v = ((e.clientY - s.lastY) / dt) * 1000;
    s.lastY = e.clientY;
    s.lastT = e.timeStamp;
    onDrag(Math.min(0, e.clientY - s.y0));
  }

  function up(e: PointerEvent<HTMLDivElement>) {
    const s = g.current;
    if (!s) return;
    g.current = null;
    const dy = e.clientY - s.y0;
    const tap = Math.abs(dy) < 6;
    onRelease(tap || dy < -60 || s.v < -500);
  }

  return (
    <div
      role="button"
      aria-label="Go to home screen"
      className="absolute inset-x-0 bottom-0 z-50 touch-none"
      // Matches the bottom padding screens reserve, so it never covers a composer.
      style={{ height: "calc(34px + env(safe-area-inset-bottom))" }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    >
      <div
        className="absolute left-1/2 h-1.25 w-33.5 -translate-x-1/2 rounded-full bg-black/80 dark:bg-white/80"
        style={{ bottom: "calc(8px + env(safe-area-inset-bottom))" }}
      />
    </div>
  );
}
