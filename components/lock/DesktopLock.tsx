"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Wifi } from "lucide-react";
import { useEffect, useState } from "react";
import { profile } from "@/content/profile";
import { useNow } from "@/lib/useNow";
import { clockTime, longDate } from "@/lib/time";
import { Avatar } from "../apps/shared";
import { BatteryGlyph } from "../icons/Glyphs";

/** macOS-style login screen: big clock up top, user at the bottom, click or press any key to unlock. */
export function DesktopLock({ onUnlock }: { onUnlock: () => void }) {
  const now = useNow();
  const reduce = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.metaKey && !e.ctrlKey && !e.altKey) onUnlock();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onUnlock]);

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label="Click to unlock"
      onClick={onUnlock}
      className="fixed inset-0 z-[100] flex cursor-default select-none flex-col items-center text-white outline-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Looping video wallpaper, like a Mac's animated lock screen. It fades in once it can play,
          so the CSS wallpaper shows until then. Reduced motion keeps it paused on the first frame. */}
      <video
        src="/lockscreen-2.mp4"
        autoPlay={!reduce}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
        onCanPlay={() => setVideoReady(true)}
        className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${videoReady ? "opacity-100" : "opacity-0"}`}
      />
      <div className="absolute inset-0 bg-black/10" />

      <div className="absolute top-2 right-4 flex items-center gap-3 text-white/90">
        <Wifi className="size-4" strokeWidth={2.5} />
        <BatteryGlyph className="h-[12px] w-[25px]" />
      </div>

      <div className="relative mt-[9vh] text-center [text-shadow:0_1px_3px_rgba(0,0,0,.25),0_2px_24px_rgba(0,0,0,.25)]">
        <p className="text-[clamp(18px,1.6vw,24px)] font-semibold text-white/90">{longDate(now)}</p>
        <p className="text-[clamp(84px,9vw,132px)] leading-none font-semibold tracking-[-0.03em] tabular-nums">
          {clockTime(now)}
        </p>
      </div>

      <div className="relative mt-auto mb-[9vh] flex flex-col items-center">
        <div className="rounded-full shadow-[0_6px_24px_rgba(0,0,0,.25)]">
          <Avatar initials={profile.initials} colors={["#a78bfa", "#6d28d9"]} size={68} />
        </div>
        <p className="mt-3 text-[15px] font-semibold [text-shadow:0_1px_2px_rgba(0,0,0,.5),0_1px_12px_rgba(0,0,0,.45)]">
          {profile.fullName}
        </p>
        <div className="mt-3 flex h-8 w-[200px] items-center justify-between rounded-full border border-white/20 bg-black/30 pr-1 pl-4 text-[13px] font-medium text-white/90 shadow-[0_2px_12px_rgba(0,0,0,.2)] backdrop-blur-xl">
          Click to unlock
          <span className="grid size-6 place-items-center rounded-full bg-white/25">
            <ArrowRight className="size-3.5" strokeWidth={2.5} />
          </span>
        </div>
        <p className="mt-3 text-[12px] font-medium text-white/90 [text-shadow:0_1px_2px_rgba(0,0,0,.5),0_1px_10px_rgba(0,0,0,.4)]">
          or press any key
        </p>
      </div>
    </motion.div>
  );
}
