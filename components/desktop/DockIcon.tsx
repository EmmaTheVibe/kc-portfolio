"use client";

import { motion, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import type { IconId } from "@/lib/apps";
import { dockIcons } from "@/lib/iconRegistry";
import { AppIcon } from "../icons/AppIcons";

type Props = {
  icon: IconId;
  label: string;
  /** Registered as a minimise target when set. */
  appId?: string;
  running: boolean;
  mouseX: MotionValue<number>;
  onClick?: () => void;
  onHover: (label: string, el: HTMLElement) => void;
};

export function DockIcon({ icon, label, appId, running, mouseX, onClick, onHover }: Props) {
  const ref = useRef<HTMLButtonElement | null>(null);

  const distance = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect();
    return r ? x - (r.left + r.width / 2) : Infinity;
  });
  const target = useTransform(distance, [-140, 0, 140], [48, 76, 48]);
  const size = useSpring(target, { mass: 0.1, stiffness: 180, damping: 14 });

  return (
    <div className="flex shrink-0 flex-col items-center">
      <motion.button
        type="button"
        aria-label={label}
        ref={(el) => {
          ref.current = el;
          if (!appId || !el) return;
          dockIcons.set(appId, el);
          return () => {
            dockIcons.delete(appId);
          };
        }}
        style={{ width: size, height: size }}
        className={`block ${onClick ? "" : "cursor-default"}`}
        onClick={onClick}
        onMouseEnter={(e) => onHover(label, e.currentTarget)}
        onMouseMove={(e) => onHover(label, e.currentTarget)}
      >
        <AppIcon icon={icon} className="size-full drop-shadow-[0_2px_4px_rgba(0,0,0,.25)]" />
      </motion.button>
      <span
        className={`mt-[3px] size-1 rounded-full ${running ? "bg-black/50 dark:bg-white/70" : "bg-transparent"}`}
      />
    </div>
  );
}
