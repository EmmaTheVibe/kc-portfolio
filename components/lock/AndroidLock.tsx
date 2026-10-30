"use client";

import { motion, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { Camera, Fingerprint, Flashlight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import wallpaper from "@/public/lockscreen-mobile.jpg";
import { threads } from "@/content/messages";
import { profile } from "@/content/profile";
import { useNow } from "@/lib/useNow";
import { lastText } from "../apps/messages/useMessages";
import { A_STATUS_H, AStatusBar, NAV_H } from "../android/SystemBars";
import { AndroidIcon } from "../icons/AndroidIcons";
import { useSwipeUnlock } from "./useSwipeUnlock";

const notification = threads[0];
const dateFmt = new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" });
const timeFmt = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" });
const shadow = "[text-shadow:0_1px_3px_rgba(0,0,0,.25),0_2px_20px_rgba(0,0,0,.2)]";

/** Pixel's big lock clock: hours stacked over minutes. */
function stackedTime(ms: number) {
  const parts = timeFmt.formatToParts(new Date(ms));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return [get("hour").padStart(2, "0"), get("minute")];
}

/** Android lock screen: swipe up anywhere (or touch the fingerprint) to unlock. */
export function AndroidLock({ reveal, onUnlock }: { reveal: MotionValue<number>; onUnlock: () => void }) {
  const reduce = useReducedMotion();
  const now = useNow();
  const { y, unlock, handlers } = useSwipeUnlock(reveal, onUnlock);
  const hintOpacity = useTransform(y, [-80, 0], [0, 1]);
  const [torch, setTorch] = useState(false);
  const [hours, minutes] = stackedTime(now);
  const stop = { onPointerDown: (e: React.PointerEvent) => e.stopPropagation() };

  return (
    <motion.div
      role="dialog"
      aria-label="Lock screen. Swipe up to unlock."
      className="fixed inset-0 z-100 touch-none select-none overflow-hidden text-white"
      style={{ y }}
      exit={{ y: -window.innerHeight, transition: reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 32 } }}
      {...handlers}
    >
      <Image src={wallpaper} alt="" fill sizes="100vw" preload placeholder="blur" draggable={false} className="object-cover" />
      <div className="absolute inset-0 bg-black/20" />
      <AStatusBar inApp={false} label={`${profile.name}'s Pixel`} />

      <div className={`relative px-6 ${shadow}`} style={{ paddingTop: `calc(${A_STATUS_H} + 12px)` }}>
        <p className="text-[16px] font-medium">{dateFmt.format(now)}</p>
        <p className="mt-8 text-center text-[clamp(120px,42vw,180px)] leading-[.86] font-medium tracking-[-0.02em] text-[#dfe6ff] tabular-nums">
          {hours}
          <br />
          {minutes}
        </p>
      </div>

      <div className="relative mx-3 mt-8">
        <button
          type="button"
          {...stop}
          onClick={unlock}
          className="w-full rounded-3xl bg-(--md-surface-container)/92 p-4 text-left text-(--md-on-surface) backdrop-blur-xl"
        >
          <span className="flex items-center gap-2 text-[12px] text-(--md-on-surface-variant)">
            <AndroidIcon icon="messages" className="size-5" />
            Messages • now
          </span>
          <span className="mt-1.5 block truncate text-[15px] font-medium">{notification.name}</span>
          <span className="line-clamp-2 text-[14px] leading-5 text-(--md-on-surface-variant)">{lastText(notification)}</span>
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center" style={{ paddingBottom: NAV_H }}>
        <button type="button" aria-label="Unlock with fingerprint" {...stop} onClick={unlock} className="grid size-16 place-items-center rounded-full">
          <Fingerprint className="size-10 opacity-90" strokeWidth={1.4} />
        </button>
        <motion.p style={{ opacity: hintOpacity }} className={`mt-2 mb-2 text-[13px] ${shadow}`}>
          Swipe up to open
        </motion.p>
        <div className="absolute inset-x-6 bottom-[calc(48px+env(safe-area-inset-bottom))] flex justify-between">
          <button
            type="button"
            aria-label="Flashlight"
            aria-pressed={torch}
            {...stop}
            onClick={() => setTorch((t) => !t)}
            className={`grid size-14 place-items-center rounded-full backdrop-blur-xl transition-colors ${
              torch ? "bg-(--md-primary-container) text-(--md-on-primary-container)" : "bg-black/30"
            }`}
          >
            <Flashlight className="size-5.5" />
          </button>
          <button type="button" aria-label="Camera" {...stop} className="grid size-14 place-items-center rounded-full bg-black/30 backdrop-blur-xl">
            <Camera className="size-5.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
