import type { ReactNode } from "react";

export const popoverPanel =
  "rounded-xl border border-black/10 bg-white/85 p-1.5 text-black/85 shadow-popover backdrop-blur-2xl dark:border-white/10 dark:bg-window-dark/90 dark:text-white/85";

/** Hover popover anchored under a menu-bar icon. The top padding bridges the hover gap. */
export function StatusPopover({ children }: { children: ReactNode }) {
  return (
    <div className="absolute right-0 top-full z-[9002] pt-1.5">
      <div className={`w-[280px] ${popoverPanel}`}>{children}</div>
    </div>
  );
}

export function PopHeading({ title, meta }: { title: string; meta?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-2.5 py-1 text-[13px] font-bold">
      <span>{title}</span>
      {meta && <span className="text-[12px] font-normal text-black/45 dark:text-white/45">{meta}</span>}
    </div>
  );
}

export function PopLabel({ children }: { children: ReactNode }) {
  return (
    <div className="px-2.5 pt-1.5 pb-0.5 text-[11px] font-semibold text-black/40 dark:text-white/40">{children}</div>
  );
}

export function PopRow({ children, muted }: { children: ReactNode; muted?: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-md px-2.5 py-1 text-[13px] hover:bg-black/5 dark:hover:bg-white/10 ${
        muted ? "text-black/45 dark:text-white/45" : ""
      }`}
    >
      {children}
    </div>
  );
}

export function PopDivider() {
  return <div className="mx-2.5 my-1 h-px bg-black/10 dark:bg-white/15" />;
}
