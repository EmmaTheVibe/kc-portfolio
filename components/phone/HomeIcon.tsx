"use client";

import { motion } from "motion/react";
import { iconLabels, type IconId } from "@/lib/apps";
import { phoneIcons } from "@/lib/iconRegistry";
import { AppIcon } from "../icons/AppIcons";

/** 60px home-screen icon. Openable apps register their node so the app can zoom in and out of it. */
export function HomeIcon({
  icon,
  appId,
  label = true,
  hidden = false,
  onOpen,
}: {
  icon: IconId;
  appId?: string;
  label?: boolean;
  /** Hides the artwork (not the label) while its app's flying copy stands in for it. */
  hidden?: boolean;
  onOpen?: (el: HTMLElement) => void;
}) {
  return (
    <motion.button
      type="button"
      aria-label={iconLabels[icon]}
      whileTap={onOpen ? undefined : { scale: 0.88 }}
      onClick={(e) => {
        const el = e.currentTarget.firstElementChild;
        if (onOpen && el instanceof HTMLElement) onOpen(el);
      }}
      className="flex w-full min-w-0 flex-col items-center gap-1.5"
    >
      <span
        ref={(el) => {
          if (!appId || !el) return;
          phoneIcons.set(appId, el);
          return () => {
            phoneIcons.delete(appId);
          };
        }}
        className={`block size-15 ${hidden ? "invisible" : ""}`}
      >
        <AppIcon icon={icon} className="block size-full" />
      </span>
      {label && (
        <span className="w-full truncate text-center text-[11px] leading-3.25 text-white [text-shadow:0_1px_2px_rgba(0,0,0,.4)]">
          {iconLabels[icon]}
        </span>
      )}
    </motion.button>
  );
}
