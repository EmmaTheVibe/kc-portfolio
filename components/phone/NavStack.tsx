"use client";

import { animate, motion, motionValue, useReducedMotion, type MotionValue } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { createContext, useContext, useState, type ReactNode } from "react";

export const PUSH_SPRING = { type: "spring", stiffness: 400, damping: 40 } as const;
export const STATUS_H = "max(env(safe-area-inset-top), 44px)";
const PARALLAX = 0.3;

type Entry<R> = { key: number; route: R; x: MotionValue<number>; offset: MotionValue<number>; leaving?: boolean };
export type Nav<R> = { push: (route: R) => void; pop: () => void };

type Layer = { pop: () => void };
const LayerContext = createContext<Layer | null>(null);

/** Closes the open app. Root screens show it as a "‹ Home" back button. */
export const HomeContext = createContext<(() => void) | null>(null);

/**
 * iPhone-style navigation stack. Screens are described by plain route data and
 * rendered fresh each time, so pushed screens always see current app state.
 */
export function NavStack<R>({ root, renderScreen }: { root: R; renderScreen: (route: R, nav: Nav<R>) => ReactNode }) {
  const reduce = useReducedMotion();
  const [stack, setStack] = useState<Entry<R>[]>(() => [
    { key: 0, route: root, x: motionValue(0), offset: motionValue(0) },
  ]);
  const t = reduce ? { duration: 0 } : PUSH_SPRING;
  const top = stack[stack.length - 1];

  const push = (route: R) => {
    if (top.leaving) return;
    const w = window.innerWidth;
    const entry: Entry<R> = { key: top.key + 1, route, x: motionValue(w), offset: motionValue(0) };
    setStack((s) => [...s, entry]);
    animate(entry.x, 0, t);
    animate(top.offset, -w * PARALLAX, t);
  };

  const pop = () => {
    if (stack.length < 2 || top.leaving) return;
    const prev = stack[stack.length - 2];
    setStack((s) => s.map((e) => (e.key === top.key ? { ...e, leaving: true } : e)));
    animate(prev.offset, 0, t);
    animate(top.x, window.innerWidth, {
      ...t,
      onComplete: () => setStack((s) => s.filter((e) => e.key !== top.key)),
    });
  };

  const nav = { push, pop };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stack.map((e, i) => (
        <motion.div
          key={e.key}
          className="absolute inset-0"
          style={{ x: e.offset, visibility: i < stack.length - 2 ? "hidden" : "visible" }}
        >
          <motion.div
            className={`absolute inset-0 ${i > 0 ? "shadow-[-8px_0_24px_rgba(0,0,0,.12)]" : ""}`}
            style={{ x: e.x }}
          >
            <LayerContext.Provider value={{ pop }}>
              {renderScreen(e.route, nav)}
            </LayerContext.Provider>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

type ScreenProps = {
  title: string;
  /** Shown next to the back chevron; omit on root screens. */
  backLabel?: string;
  largeTitle?: boolean;
  /** Replaces the compact centred title. */
  titleNode?: ReactNode;
  trailing?: ReactNode;
  /** Pinned below the scroll area (e.g. a composer). */
  bottom?: ReactNode;
  plain?: boolean;
  bgClass?: string;
  children: ReactNode;
};

/** A screen with a large title that collapses into a blurred nav bar. Back is the button only: no edge swipe. */
export function NavScreen({ title, backLabel, largeTitle, titleNode, trailing, bottom, plain, bgClass, children }: ScreenProps) {
  const layer = useContext(LayerContext);
  const goHome = useContext(HomeContext);
  const back = backLabel
    ? { label: backLabel, onClick: () => layer?.pop() }
    : goHome && { label: "Home", onClick: goHome };
  const [scrolled, setScrolled] = useState(false);

  const bg = bgClass ?? (plain ? "bg-white dark:bg-black" : "bg-[#f2f2f7] dark:bg-black");
  const barBg = bgClass ? "bg-inherit" : plain ? "bg-white/80 dark:bg-black/80" : "bg-[#f2f2f7]/80 dark:bg-black/80";
  const showCompact = !largeTitle || scrolled;

  return (
    <div className={`absolute inset-0 flex flex-col ${bg}`}>
      <header className="absolute inset-x-0 top-0 z-20">
        <div
          className={`absolute inset-0 border-b-[0.5px] backdrop-blur-xl transition-opacity duration-200 ${barBg} ${
            scrolled ? "border-black/12 opacity-100 dark:border-white/15" : "border-transparent opacity-0"
          }`}
        />
        <div style={{ height: STATUS_H }} />
        <div className="relative flex h-11 items-center px-2">
          {back && (
            <button
              type="button"
              onClick={back.onClick}
              className="relative z-10 flex max-w-[40%] items-center text-[17px] text-accent"
            >
              <ChevronLeft className="-mr-0.5 size-7 shrink-0" strokeWidth={2.2} />
              <span className="truncate">{back.label}</span>
            </button>
          )}
          <div
            className={`pointer-events-none absolute inset-x-30 flex justify-center overflow-hidden text-[17px] leading-5.5 font-semibold transition-opacity duration-200 ${
              showCompact ? "opacity-100" : "opacity-0"
            }`}
          >
            {titleNode ?? <span className="truncate">{title}</span>}
          </div>
          <div className="relative z-10 ml-auto flex items-center gap-3 pr-2 text-accent">{trailing}</div>
        </div>
      </header>

      <div
        data-scroller
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > (largeTitle ? 34 : 2))}
        className="no-scrollbar min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain"
        style={{ paddingTop: `calc(${STATUS_H} + 44px)` }}
      >
        {largeTitle && <h1 className="px-4 pb-2 text-[34px] leading-10.25 font-bold">{title}</h1>}
        {children}
        {!bottom && <div style={{ height: "calc(env(safe-area-inset-bottom) + 40px)" }} />}
      </div>
      {bottom}
    </div>
  );
}

/** Wraps content pinned at the bottom of a screen, leaving room for the home indicator. */
export function BottomBar({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`shrink-0 border-t-[0.5px] border-black/12 px-3 pt-2 backdrop-blur-xl dark:border-white/15 ${className}`}
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 34px)" }}
    >
      {children}
    </div>
  );
}
