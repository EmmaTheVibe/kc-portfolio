"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useState, type ReactNode } from "react";
import { A_STATUS_H, NAV_H } from "./SystemBars";

const EMPHASIZED = [0.2, 0, 0, 1] as const;

export type ANav<R> = { push: (route: R) => void; pop: () => void };

/**
 * Material navigation: a pushed screen fades and slides in a little from the right (the
 * "shared axis" pattern) over the one below, which stays mounted so its scroll position survives.
 */
export function AStack<R>({ root, render }: { root: R; render: (route: R, nav: ANav<R>) => ReactNode }) {
  const [stack, setStack] = useState<{ key: number; route: R }[]>([{ key: 0, route: root }]);
  const nav: ANav<R> = {
    push: (route) => setStack((s) => [...s, { key: s[s.length - 1].key + 1, route }]),
    pop: () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)),
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence initial={false}>
        {stack.map(({ key, route }, i) => (
          <motion.div
            key={key}
            className="absolute inset-0"
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 48 }}
            transition={{ duration: 0.3, ease: EMPHASIZED }}
            inert={i < stack.length - 1}
          >
            {render(route, nav)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function IconButton({ label, onClick, children, className = "" }: { label: string; onClick?: () => void; children: ReactNode; className?: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`grid size-12 shrink-0 place-items-center rounded-full active:bg-(--md-on-surface)/10 ${className}`}
    >
      {children}
    </button>
  );
}

type ScreenProps = {
  title?: string;
  /** Shows a ← in the top app bar. Root screens leave it out: the nav bar's Back goes home. */
  onBack?: () => void;
  actions?: ReactNode;
  /** Replaces the top app bar (search bars, tabs…). */
  header?: ReactNode;
  /** Pinned under the scroll area, above the nav bar (a composer, a navigation bar…). */
  bottom?: ReactNode;
  /** Background behind `bottom` and the system nav bar under it, when it differs from the screen's. */
  bottomBg?: string;
  /** Background for the whole screen, bars included. */
  bg?: string;
  children: ReactNode;
};

/** A Material 3 screen: a small top app bar that tints once content scrolls under it. */
export function AScreen({ title, onBack, actions, header, bottom, bottomBg = "", bg = "bg-(--md-surface)", children }: ScreenProps) {
  const [scrolled, setScrolled] = useState(false);

  return (
    <div className={`absolute inset-0 flex flex-col text-(--md-on-surface) ${bg}`}>
      <header
        className={`shrink-0 transition-colors duration-200 ${scrolled && !header ? "bg-(--md-on-surface)/5" : ""}`}
        style={{ paddingTop: A_STATUS_H }}
      >
        {header ?? (
          <div className="flex h-16 items-center gap-1 px-1">
            {onBack && (
              <IconButton label="Back" onClick={onBack}>
                <ArrowLeft className="size-6" />
              </IconButton>
            )}
            <h1 className={`min-w-0 flex-1 truncate text-[22px] ${onBack ? "pl-1" : "pl-3"}`}>{title}</h1>
            {actions}
          </div>
        )}
      </header>
      <div
        data-scroller
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 2)}
        className="no-scrollbar min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain"
      >
        {children}
        {!bottom && <div className="h-6" />}
      </div>
      <div className={`shrink-0 ${bottomBg}`} style={{ paddingBottom: NAV_H }}>
        {bottom}
      </div>
    </div>
  );
}

/** A one- or two-line list item with optional leading and trailing content. */
export function ListItem({
  leading,
  headline,
  supporting,
  trailing,
  onClick,
}: {
  leading?: ReactNode;
  headline: ReactNode;
  supporting?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
}) {
  const cls = "flex min-h-14 w-full items-center gap-4 px-4 py-2 text-left";
  const content = (
    <>
      {leading}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[16px]">{headline}</span>
        {supporting && <span className="line-clamp-2 block text-[14px] leading-5 text-(--md-on-surface-variant)">{supporting}</span>}
      </span>
      {trailing}
    </>
  );
  return onClick ? (
    <button type="button" onClick={onClick} className={`${cls} active:bg-(--md-on-surface)/10`}>
      {content}
    </button>
  ) : (
    <div className={cls}>{content}</div>
  );
}

/** Material 3 switch: a pill track whose thumb grows when on. */
export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-8 w-13 shrink-0 rounded-full border-2 transition-colors ${
        checked ? "border-(--md-primary) bg-(--md-primary)" : "border-(--md-outline) bg-(--md-surface-container-highest)"
      }`}
    >
      <span
        className={`absolute top-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ${
          checked ? "left-[22px] size-6 bg-(--md-on-primary)" : "left-1 size-4 bg-(--md-outline)"
        }`}
      />
    </button>
  );
}

export function Radio({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={`grid size-5 shrink-0 place-items-center rounded-full border-2 ${checked ? "border-(--md-primary)" : "border-(--md-on-surface-variant)"}`}
    >
      {checked && <span className="size-2.5 rounded-full bg-(--md-primary)" />}
    </span>
  );
}

/** The pill search bar Google's apps put at the top, with a leading icon and a trailing slot (usually the avatar). */
export function SearchBar({
  value,
  onChange,
  placeholder,
  leading,
  trailing,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  leading: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <label className="mx-4 my-2 flex h-14 items-center gap-1 rounded-full bg-(--md-surface-container-high) pr-2 pl-1 text-(--md-on-surface-variant)">
      <span className="grid size-12 shrink-0 place-items-center">{leading}</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[16px] text-(--md-on-surface) outline-none placeholder:text-(--md-on-surface-variant)"
      />
      {trailing}
    </label>
  );
}
