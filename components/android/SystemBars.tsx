"use client";

import { useNow } from "@/lib/useNow";
import { clockTime } from "@/lib/time";

export const A_STATUS_H = "max(env(safe-area-inset-top), 36px)";
/** The three-button navigation bar. Screens leave this much room at the bottom. */
export const NAV_H = "calc(48px + env(safe-area-inset-bottom))";

/** Android's status bar: clock on the left, filled Wi-Fi, signal and an upright battery on the right. */
export function AStatusBar({ inApp, label }: { inApp: boolean; label?: string }) {
  const time = clockTime(useNow());
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between px-6 text-[14px] font-medium transition-colors duration-200 ${
        inApp ? "text-(--md-on-surface)" : "text-white"
      }`}
      style={{ height: A_STATUS_H }}
    >
      <span className="tabular-nums">{label ?? time}</span>
      <svg viewBox="0 0 58 16" className="h-4 w-14.5" aria-hidden>
        <g fill="currentColor">
          {/* Wi-Fi: a filled wedge */}
          <path d="M8 14.5L.6 5.2a11.6 11.6 0 0 1 14.8 0Z" />
          {/* Signal: a filled triangle */}
          <path d="M37 1.5v13H24Z" />
          {/* Battery: upright, 87% full */}
          <rect x="49" y="1" width="3" height="1.6" rx=".5" />
          <rect x="45.6" y="2.4" width="9.8" height="12.6" rx="2" fillOpacity=".4" />
          <rect x="45.6" y="4" width="9.8" height="11" rx="2" />
        </g>
      </svg>
    </div>
  );
}

/**
 * The classic three-button bar. Back and Home both close the open app (the site's choice:
 * apps are one screen deep as far as the system is concerned); Recents is decoration.
 */
export function ANavBar({ inApp, onHome }: { inApp: boolean; onHome: () => void }) {
  const btn = "grid h-full w-20 place-items-center rounded-full active:bg-current/10";
  return (
    <nav
      aria-label="Navigation"
      className={`absolute inset-x-0 bottom-0 z-50 flex justify-center gap-6 transition-colors duration-200 ${
        inApp ? "text-(--md-on-surface)" : "text-white"
      }`}
      style={{ height: NAV_H, paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <button type="button" aria-label="Back" onClick={onHome} className={btn}>
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
          <path d="M18 4.5v15L5.5 12Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </button>
      <button type="button" aria-label="Home" onClick={onHome} className={btn}>
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
          <circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>
      <span aria-hidden className={btn}>
        <svg viewBox="0 0 24 24" className="size-5">
          <rect x="5" y="5" width="14" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </span>
    </nav>
  );
}
