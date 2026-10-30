"use client";

import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import { clamp, clampPosition, effectiveMin, type Geom, type Size } from "@/lib/geometry";
import type { IconId } from "@/lib/apps";
import { minimizeDelta, windowEls } from "@/lib/iconRegistry";
import type { DesktopSkin } from "@/lib/platform";
import type { MinimizeDelta } from "@/lib/useWindowManager";
import { WinIcon } from "../icons/WinIcons";
import { CaptionButtons } from "../windows/CaptionButtons";
import { TrafficLights } from "./TrafficLights";

export const WINDOW_SPRING = { type: "spring", stiffness: 430, damping: 34, mass: 0.8 } as const;
const MINIMIZE_EASE = { duration: 0.3, ease: [0.45, 0, 0.7, 0.2] } as const;

type Dir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const HANDLES: { dir: Dir; className: string }[] = [
  { dir: "n", className: "-top-1 inset-x-2 h-2 cursor-n-resize" },
  { dir: "s", className: "-bottom-1 inset-x-2 h-2 cursor-s-resize" },
  { dir: "e", className: "-right-1 inset-y-2 w-2 cursor-e-resize" },
  { dir: "w", className: "-left-1 inset-y-2 w-2 cursor-w-resize" },
  { dir: "ne", className: "-top-1 -right-1 size-3.5 cursor-ne-resize" },
  { dir: "nw", className: "-top-1 -left-1 size-3.5 cursor-nw-resize" },
  { dir: "se", className: "-bottom-1 -right-1 size-3.5 cursor-se-resize" },
  { dir: "sw", className: "-bottom-1 -left-1 size-3.5 cursor-sw-resize" },
];

type Props = {
  id: string;
  title: string;
  skin: DesktopSkin;
  /** Shown beside the title on Windows. */
  icon?: IconId;
  geom: Geom;
  min: Size;
  desk: Size;
  resizable: boolean;
  maximizable: boolean;
  maximized: boolean;
  minimized: boolean;
  minimizeDelta: MinimizeDelta | null;
  zIndex: number;
  focused: boolean;
  onClose: () => void;
  onMinimize: (delta: MinimizeDelta) => void;
  onToggleMaximize: () => void;
  onFocus: () => void;
  onGeomChange: (geom: Geom) => void;
  children: ReactNode;
};

type Session =
  | { kind: "move"; px: number; py: number; g: Geom }
  | { kind: "resize"; dir: Dir; px: number; py: number; g: Geom };

export function Window(p: Props) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const session = useRef<Session | null>(null);

  const target = p.maximized ? { x: 0, y: 0, w: p.desk.w, h: p.desk.h } : p.geom;
  const left = useMotionValue(target.x);
  const top = useMotionValue(target.y);
  const width = useMotionValue(target.w);
  const height = useMotionValue(target.h);

  // Spring only when maximise toggles; any other geometry change (drag commit,
  // re-clamp, browser resize while maximised) is applied directly.
  const prevMax = useRef(p.maximized);
  useEffect(() => {
    if (session.current) return;
    const toggled = prevMax.current !== p.maximized;
    prevMax.current = p.maximized;
    const pairs = [
      [left, target.x],
      [top, target.y],
      [width, target.w],
      [height, target.h],
    ] as const;
    if (!toggled || reduce) {
      pairs.forEach(([mv, v]) => mv.set(v));
      return;
    }
    const controls = pairs.map(([mv, v]) => animate(mv, v, WINDOW_SPRING));
    return () => controls.forEach((c) => c.stop());
  }, [target.x, target.y, target.w, target.h, p.maximized, reduce, left, top, width, height]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    windowEls.set(p.id, el);
    return () => {
      windowEls.delete(p.id);
    };
  }, [p.id]);

  const current = (): Geom => ({ x: left.get(), y: top.get(), w: width.get(), h: height.get() });

  function begin(e: PointerEvent<HTMLElement>, s: Session) {
    e.currentTarget.setPointerCapture(e.pointerId);
    session.current = s;
  }

  function onTitlePointerDown(e: PointerEvent<HTMLElement>) {
    if (e.button !== 0 || p.maximized) return;
    begin(e, { kind: "move", px: e.clientX, py: e.clientY, g: current() });
  }

  function onHandlePointerDown(e: PointerEvent<HTMLElement>, dir: Dir) {
    if (e.button !== 0) return;
    e.stopPropagation();
    p.onFocus();
    begin(e, { kind: "resize", dir, px: e.clientX, py: e.clientY, g: current() });
  }

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    const s = session.current;
    if (!s) return;
    const dx = e.clientX - s.px;
    const dy = e.clientY - s.py;
    const { g } = s;
    const desk = p.desk;

    if (s.kind === "move") {
      const pos = clampPosition(g.x + dx, g.y + dy, g.w, desk);
      left.set(pos.x);
      top.set(pos.y);
      return;
    }

    const m = effectiveMin(p.min, desk);
    if (s.dir.includes("e")) width.set(clamp(g.w + dx, m.w, Math.max(m.w, desk.w - g.x)));
    if (s.dir.includes("s")) height.set(clamp(g.h + dy, m.h, Math.max(m.h, desk.h - g.y)));
    if (s.dir.includes("w")) {
      const x = clamp(g.x + dx, Math.min(0, g.x), g.x + g.w - m.w);
      left.set(x);
      width.set(g.x + g.w - x);
    }
    if (s.dir.includes("n")) {
      const y = clamp(g.y + dy, 0, g.y + g.h - m.h);
      top.set(y);
      height.set(g.y + g.h - y);
    }
  }

  function onPointerUp() {
    if (!session.current) return;
    session.current = null;
    p.onGeomChange(current());
  }

  const minimize = () => p.onMinimize(minimizeDelta(p.id));
  const win = p.skin === "windows";

  const d = p.minimizeDelta ?? { dx: 0, dy: 300 };
  const dragHandlers = { onPointerMove, onPointerUp, onPointerCancel: onPointerUp };

  return (
    <motion.div
      ref={rootRef}
      role="dialog"
      aria-label={p.title || "About This Site"}
      className={`absolute flex flex-col border ${
        win
          ? `bg-[#f3f3f3] dark:bg-[#202020] ${p.maximized ? "rounded-none" : "rounded-lg"} ${
              p.focused
                ? "border-black/15 shadow-window-focused dark:border-white/12"
                : "border-black/10 shadow-window dark:border-white/8"
            }`
          : `rounded-xl backdrop-blur-2xl ${
              p.focused
                ? "border-black/10 bg-window/80 shadow-window-focused dark:border-white/15 dark:bg-window-dark/75"
                : "border-black/8 bg-window/80 shadow-window dark:border-white/10 dark:bg-window-dark/75"
            }`
      }`}
      style={{
        left,
        top,
        width,
        height,
        zIndex: p.zIndex,
        pointerEvents: p.minimized ? "none" : "auto",
      }}
      initial={{ opacity: 0, scale: 0.92, y: 12 }}
      animate={
        p.minimized
          ? { x: d.dx, y: d.dy, scale: 0.06, opacity: 0, transition: MINIMIZE_EASE }
          : { x: 0, y: 0, scale: 1, opacity: p.focused || win ? 1 : 0.97, transition: WINDOW_SPRING }
      }
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.16 } }}
      onPointerDownCapture={p.onFocus}
    >
      <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[inherit]">
        {win ? (
          <div
            className="flex h-8 shrink-0 cursor-default touch-none items-center bg-[#f3f3f3] pl-3 text-black dark:bg-[#202020] dark:text-white"
            onPointerDown={onTitlePointerDown}
            onDoubleClick={() => p.maximizable && p.onToggleMaximize()}
            {...dragHandlers}
          >
            {p.icon && <WinIcon icon={p.icon} className="mr-2 size-4 shrink-0" />}
            <span className={`min-w-0 flex-1 truncate text-[12px] ${p.focused ? "" : "opacity-50"}`}>{p.title}</span>
            <CaptionButtons
              focused={p.focused}
              maximizable={p.maximizable}
              maximized={p.maximized}
              onClose={p.onClose}
              onMinimize={minimize}
              onToggleMaximize={p.onToggleMaximize}
            />
          </div>
        ) : (
          <div
            className="relative flex h-10 shrink-0 cursor-default touch-none items-center border-b border-black/5 px-3 dark:border-white/5"
            onPointerDown={onTitlePointerDown}
            onDoubleClick={() => p.maximizable && p.onToggleMaximize()}
            {...dragHandlers}
          >
            <div className="relative z-10">
              <TrafficLights
                focused={p.focused}
                maximizable={p.maximizable}
                onClose={p.onClose}
                onMinimize={minimize}
                onZoom={p.onToggleMaximize}
              />
            </div>
            <div
              className={`pointer-events-none absolute inset-x-0 truncate px-24 text-center text-[13px] font-semibold ${
                p.focused ? "text-black/70 dark:text-white/70" : "text-black/35 dark:text-white/35"
              }`}
            >
              {p.title}
            </div>
          </div>
        )}
        <div className="@container flex min-h-0 flex-1 flex-col">{p.children}</div>
      </div>

      {p.resizable &&
        !p.maximized &&
        HANDLES.map((h) => (
          <div
            key={h.dir}
            className={`absolute touch-none ${h.className}`}
            onPointerDown={(e) => onHandlePointerDown(e, h.dir)}
            {...dragHandlers}
          />
        ))}
    </motion.div>
  );
}
