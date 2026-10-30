"use client";

import { motion, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { Camera, Flashlight, Lock, LockOpen } from "lucide-react";
import Image from "next/image";
import wallpaper from "@/public/lockscreen-mobile.jpg";
import { useState } from "react";
import { lastText } from "../apps/messages/useMessages";
import { threads } from "@/content/messages";
import { profile } from "@/content/profile";
import { useNow } from "@/lib/useNow";
import { clockTime, longDate } from "@/lib/time";
import { AppIcon } from "../icons/AppIcons";
import { STATUS_H } from "../phone/NavStack";
import { StatusBar } from "../phone/StatusBar";
import { useSwipeUnlock } from "./useSwipeUnlock";

const notification = threads[0];

/**
 * iOS-style lock screen. Dragging up anywhere slides it away; `reveal` (0→1) is
 * shared with the shell so the home screen zooms in underneath as you drag.
 */
export function PhoneLock({
  reveal,
  onUnlock,
}: {
  reveal: MotionValue<number>;
  onUnlock: () => void;
}) {
  const reduce = useReducedMotion();
  const now = useNow();
  const { y, opening, unlock, handlers } = useSwipeUnlock(reveal, onUnlock);
  const hintOpacity = useTransform(y, [-80, 0], [0, 1]);
  const [torch, setTorch] = useState(false);

  const LockGlyph = opening ? LockOpen : Lock;

  return (
    <motion.div
      role="dialog"
      aria-label="Lock screen. Swipe up to unlock."
      className="fixed inset-0 z-100 touch-none select-none overflow-hidden text-white"
      style={{ y }}
      exit={{
        y: -window.innerHeight,
        transition: reduce
          ? { duration: 0 }
          : { type: "spring", stiffness: 260, damping: 32 },
      }}
      {...handlers}
    >
      {/* Lock-screen wallpaper. Slides up with the lock, revealing the home screen's own wallpaper.
          Next serves a resized, compressed copy sized to the phone. */}
      <Image
        src={wallpaper}
        alt=""
        fill
        sizes="100vw"
        preload
        placeholder="blur"
        draggable={false}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/10" />
      <StatusBar inApp={false} label={`${profile.name}'s Phone`} />

      <div
        className="relative flex flex-col items-center [text-shadow:0_1px_3px_rgba(0,0,0,.25),0_2px_20px_rgba(0,0,0,.25)]"
        style={{ paddingTop: `calc(${STATUS_H} + 4px)` }}
      >
        <LockGlyph className="size-4.5" strokeWidth={2.4} />
        <p className="mt-3 text-[19px] font-semibold text-white/90">
          {longDate(now)}
        </p>
        <p className="-mt-1 text-[clamp(76px,26vw,112px)] leading-[1.05] font-semibold tracking-[-0.03em] tabular-nums">
          {clockTime(now)}
        </p>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 px-3"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 8px)" }}
      >
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={unlock}
          className="mb-6 flex w-full items-start gap-2.5 rounded-dock bg-white/55 p-3 text-left text-black backdrop-blur-xl dark:bg-black/40 dark:text-white"
        >
          <AppIcon icon="messages" className="mt-0.5 size-9.5 shrink-0" />
          <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-2">
              <span className="truncate text-[15px] font-semibold">
                {notification.name}
              </span>
              <span className="shrink-0 text-[13px] text-black/45 dark:text-white/45">
                now
              </span>
            </span>
            <span className="line-clamp-2 text-[15px] leading-5">
              {lastText(notification)}
            </span>
          </span>
        </button>

        <div className="flex items-center justify-between px-9">
          <button
            type="button"
            aria-label="Flashlight"
            aria-pressed={torch}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setTorch((t) => !t)}
            className={`grid size-12.5 place-items-center rounded-full backdrop-blur-xl transition-colors ${
              torch ? "bg-white text-black" : "bg-black/30"
            }`}
          >
            <Flashlight className="size-5.5" strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="Camera"
            onPointerDown={(e) => e.stopPropagation()}
            className="grid size-12.5 place-items-center rounded-full bg-black/30 backdrop-blur-xl"
          >
            <Camera className="size-5.5" strokeWidth={2} />
          </button>
        </div>

        <motion.p
          style={{ opacity: hintOpacity }}
          className="mt-4 text-center text-[13px] font-semibold text-white/95 [text-shadow:0_1px_2px_rgba(0,0,0,.5),0_1px_10px_rgba(0,0,0,.45)]"
        >
          Swipe up to open
        </motion.p>
        <div className="mx-auto mt-2.5 mb-1.5 h-1.25 w-33.5 rounded-full bg-white" />
      </div>
    </motion.div>
  );
}
