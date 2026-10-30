"use client";

import { animate, useMotionValue, useReducedMotion, type MotionValue } from "motion/react";
import { useEffect, useRef, useState, type PointerEvent } from "react";

const SNAP_BACK = { type: "spring", stiffness: 500, damping: 40 } as const;

/**
 * Swipe-up-to-unlock for the phone lock screens. `y` follows the finger; `reveal` (0→1) is shared
 * with the shell so the home screen zooms in underneath. Enter, Space or ↑ unlock from the keyboard.
 */
export function useSwipeUnlock(reveal: MotionValue<number>, onUnlock: () => void) {
  const reduce = useReducedMotion();
  const y = useMotionValue(0);
  const [opening, setOpening] = useState(false);
  const drag = useRef<{ y0: number; lastY: number; lastT: number; v: number } | null>(null);

  const unlock = () => {
    setOpening(true);
    onUnlock();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowUp") unlock();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function onPointerDown(e: PointerEvent<HTMLElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { y0: e.clientY, lastY: e.clientY, lastT: e.timeStamp, v: 0 };
  }

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    const d = drag.current;
    if (!d) return;
    const dy = e.clientY - d.y0;
    const dt = e.timeStamp - d.lastT;
    if (dt > 0) d.v = ((e.clientY - d.lastY) / dt) * 1000;
    d.lastY = e.clientY;
    d.lastT = e.timeStamp;
    // Rubber-band downward drags; follow the finger upward.
    y.set(dy < 0 ? dy : dy * 0.15);
    reveal.set(Math.min(1, Math.max(0, -dy / (window.innerHeight * 0.6))));
    setOpening(dy < -window.innerHeight * 0.25);
  }

  function onPointerUp(e: PointerEvent<HTMLElement>) {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    const dy = e.clientY - d.y0;
    if (dy < -window.innerHeight * 0.25 || (d.v < -500 && dy < -20)) {
      unlock();
    } else {
      setOpening(false);
      const t = reduce ? { duration: 0 } : SNAP_BACK;
      animate(y, 0, t);
      animate(reveal, 0, t);
    }
  }

  return {
    y,
    opening,
    unlock,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
  };
}
