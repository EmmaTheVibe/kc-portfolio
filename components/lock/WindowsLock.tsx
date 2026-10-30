"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Accessibility, ArrowRight, MonitorCheck, Power, Wifi } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import lockPhoto from "@/public/wallpaper-pc-windows.jpg";
import { notes } from "@/content/notes";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { useNow } from "@/lib/useNow";
import { clockTime, longDate } from "@/lib/time";
import { Avatar, ProjectIcon } from "../apps/shared";

/** The lock-screen photo. Next serves a copy resized for the screen. */
function LockPhoto() {
  return <Image src={lockPhoto} alt="" fill sizes="100vw" preload placeholder="blur" draggable={false} className="object-cover" />;
}

const CURTAIN_SPRING = { type: "spring", stiffness: 260, damping: 32 } as const;
const shadow = "[text-shadow:0_1px_3px_rgba(0,0,0,.3),0_2px_24px_rgba(0,0,0,.25)]";
const latestWriting = notes.find((n) => n.group === "Writing" && !n.comingSoon);
const latestProject = projects[0];

/** A lock-screen widget card: title, content and a "See more" footer, like Windows' weather/markets cards. */
function Widget({ title, footer, children }: { title: string; footer: string; children: ReactNode }) {
  return (
    <div className="flex h-31 w-65 shrink-0 flex-col rounded-lg border border-white/15 bg-[#1b2a6b]/45 px-3 pt-2.5 pb-2 text-white shadow-[0_4px_20px_rgba(0,0,0,.15)] backdrop-blur-xl">
      <p className="text-[12px] font-semibold">{title}</p>
      <div className="min-h-0 flex-1 pt-1.5">{children}</div>
      <p className="text-center text-[11px] text-[#a8d4ff]">{footer}</p>
    </div>
  );
}

/**
 * Windows 11 lock screen in two steps. The clock "curtain" (time, date, widgets) lifts on a click or
 * key, revealing the sign-in screen: Mark's picture and a Sign in button where the password would be.
 */
export function WindowsLock({ onUnlock }: { onUnlock: () => void }) {
  const now = useNow();
  const reduce = useReducedMotion();
  const [signIn, setSignIn] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (!signIn) setSignIn(true);
      else if (e.key === "Enter") onUnlock();
      else if (e.key === "Escape") setSignIn(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [signIn, onUnlock]);

  return (
    <motion.div
      role="dialog"
      aria-label="Lock screen"
      className="fixed inset-0 z-100 select-none overflow-hidden text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Sign-in screen, waiting behind the curtain: the same photo, blurred and dimmed. */}
      <div className="absolute inset-0" inert={!signIn}>
        <LockPhoto />
        <div className="absolute inset-0 bg-black/35 backdrop-blur-3xl" />
        <AnimatePresence>
          {signIn && (
            <motion.div
              className={`relative flex h-full flex-col items-center justify-center pb-[8vh] ${shadow}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: reduce ? 0 : 0.15, duration: 0.25 } }}
              exit={{ opacity: 0 }}
            >
              <div className="rounded-full shadow-[0_8px_32px_rgba(0,0,0,.3)]">
                <Avatar initials={profile.initials} colors={["#a78bfa", "#6d28d9"]} size={192} />
              </div>
              <p className="mt-5 text-[28px] font-semibold">{profile.fullName}</p>
              <button
                type="button"
                autoFocus
                onClick={onUnlock}
                className="mt-6 flex h-9 min-w-36 items-center justify-center gap-2 rounded-md border border-white/25 bg-white/15 px-6 text-[14px] [text-shadow:none] backdrop-blur-xl transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white"
              >
                Sign in <ArrowRight className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setSignIn(false)}
                className="mt-4 text-[12px] text-white/80 [text-shadow:none] hover:text-white"
              >
                Back to lock screen
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute right-6 bottom-5 flex items-center gap-5">
          <Wifi className="size-5" strokeWidth={1.75} />
          <Accessibility className="size-5" strokeWidth={1.75} />
          <Power className="size-5" strokeWidth={1.75} />
        </div>
      </div>

      {/* Clock curtain. */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center"
        animate={{ y: signIn ? "-100%" : 0 }}
        transition={reduce ? { duration: 0 } : CURTAIN_SPRING}
        onClick={() => setSignIn(true)}
        aria-hidden={signIn}
      >
        <LockPhoto />
        <div className="absolute inset-0 bg-black/10" />

        <div className={`relative mt-[11vh] text-center ${shadow}`}>
          <p className="text-[clamp(84px,8.4vw,128px)] leading-none font-semibold tracking-[-0.01em] tabular-nums">
            {clockTime(now)}
          </p>
          <p className="mt-4 text-[clamp(18px,1.6vw,24px)] font-semibold">{longDate(now)}</p>
        </div>

        <div className="relative mt-auto mb-7 flex max-w-[calc(100vw-32px)] flex-wrap justify-center gap-2.5">
          <Widget title={profile.fullName} footer="See more in Settings">
            <div className="flex items-center gap-3">
              <Avatar initials={profile.initials} colors={["#a78bfa", "#6d28d9"]} size={44} />
              <div className="min-w-0 text-[12px] leading-snug">
                <p className="truncate font-semibold">{profile.role}</p>
                <p className="truncate text-white/80">{profile.location}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[#7ee2a0]">
                  <span className="size-1.5 rounded-full bg-[#7ee2a0]" /> {profile.status}
                </p>
              </div>
            </div>
          </Widget>
          <Widget title="Latest project" footer="See more in Microsoft Store">
            <div className="flex items-center gap-3">
              <ProjectIcon project={latestProject} size={44} />
              <div className="min-w-0 text-[12px] leading-snug">
                <p className="truncate font-semibold">{latestProject.name}</p>
                <p className="line-clamp-2 text-white/80">{latestProject.tagline}</p>
              </div>
            </div>
          </Widget>
          {latestWriting && (
            <Widget title="Latest writing" footer="See more in Sticky Notes">
              <div className="text-[12px] leading-snug">
                <p className="truncate font-semibold">{latestWriting.title}</p>
                <p className="line-clamp-2 text-white/80">{latestWriting.subtitle ?? latestWriting.preview}</p>
                <p className="mt-0.5 text-white/60">{latestWriting.date}</p>
              </div>
            </Widget>
          )}
        </div>

        <MonitorCheck className="absolute right-5 bottom-5 size-4.5 opacity-90" strokeWidth={1.75} />
      </motion.div>
    </motion.div>
  );
}
