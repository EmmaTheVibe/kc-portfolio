"use client";

import { motion } from "motion/react";
import { MapPin, Mic } from "lucide-react";
import { profile } from "@/content/profile";
import { androidDock, androidHome, androidLabels, type IconId, type PhoneAppId } from "@/lib/apps";
import { phoneIcons } from "@/lib/iconRegistry";
import { useNow } from "@/lib/useNow";
import { Avatar } from "../apps/shared";
import { AndroidIcon, GoogleG, LensMark } from "../icons/AndroidIcons";
import { A_STATUS_H, NAV_H } from "./SystemBars";

type Open = (id: PhoneAppId, el: HTMLElement) => void;

const glanceFmt = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "short", day: "numeric" });
const shadow = "[text-shadow:0_1px_3px_rgba(0,0,0,.35)]";

/** A circular launcher icon. Openable apps register their artwork so the app can grow out of it. */
function Icon({ icon, appId, label = true, hidden, onOpen }: { icon: IconId; appId?: PhoneAppId; label?: boolean; hidden?: boolean; onOpen?: Open }) {
  return (
    <motion.button
      type="button"
      aria-label={androidLabels[icon]}
      whileTap={appId ? undefined : { scale: 0.9 }}
      onClick={(e) => {
        const el = e.currentTarget.firstElementChild;
        if (appId && onOpen && el instanceof HTMLElement) onOpen(appId, el);
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
        className={`block size-14 rounded-full shadow-[0_1px_3px_rgba(0,0,0,.25)] ${hidden ? "invisible" : ""}`}
      >
        <AndroidIcon icon={icon} className="block size-full" />
      </span>
      {label && <span className={`w-full truncate text-center text-[12px] leading-4 text-white ${shadow}`}>{androidLabels[icon]}</span>}
    </motion.button>
  );
}

/** Material You profile widget, 4×2. Tapping it opens Keep, where the introduction lives. */
function ProfileWidget({ onOpen }: { onOpen: Open }) {
  return (
    <button
      type="button"
      onClick={(e) => onOpen("notes", e.currentTarget)}
      className="col-span-4 flex items-center gap-4 rounded-[28px] bg-(--md-primary-container) p-4 text-left text-(--md-on-primary-container) active:scale-[.98]"
    >
      <Avatar initials={profile.initials} colors={["#a78bfa", "#6d28d9"]} size={64} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[20px] leading-7">{profile.fullName}</span>
        <span className="block truncate text-[14px] opacity-80">{profile.role}</span>
        <span className="mt-2 flex items-center gap-2 text-[12px]">
          <span className="rounded-full bg-(--md-primary) px-2.5 py-0.5 font-medium text-(--md-on-primary)">{profile.status}</span>
          <span className="flex min-w-0 items-center gap-0.5 opacity-80">
            <MapPin className="size-3 shrink-0" />
            <span className="truncate">{profile.location}</span>
          </span>
        </span>
      </span>
    </button>
  );
}

/** Pixel home screen: At a Glance, the profile widget and apps, then the dock and Google search bar. */
export function AndroidHome({ onOpen, hiddenIcon }: { onOpen: Open; hiddenIcon: PhoneAppId | null }) {
  const now = useNow();

  return (
    <div className="flex h-full flex-col" style={{ paddingTop: A_STATUS_H, paddingBottom: NAV_H }}>
      <div className={`px-6 pt-5 text-white ${shadow}`}>
        <p className="text-[24px] leading-8">{glanceFmt.format(now)}</p>
        <p className="text-[14px] opacity-90">{profile.location}</p>
      </div>

      <div className="mt-7 grid grid-cols-4 gap-x-2 gap-y-6 px-4">
        {androidHome.map((item) => {
          if (item.kind === "widget") return <ProfileWidget key="widget" onOpen={onOpen} />;
          if (item.kind === "deco") return <Icon key={item.icon} icon={item.icon} />;
          return <Icon key={item.id} icon={item.id} appId={item.id} hidden={item.id === hiddenIcon} onOpen={onOpen} />;
        })}
      </div>

      <div className="flex-1" />

      <div className="grid grid-cols-4 gap-x-2 px-4">
        {androidDock.map((id) => (
          <Icon key={id} icon={id} appId={id} label={false} hidden={id === hiddenIcon} onOpen={onOpen} />
        ))}
      </div>

      <div className="mx-4 mt-4 mb-3 flex h-14 items-center gap-3 rounded-full bg-(--md-surface-container-high) pr-2 pl-4 text-(--md-on-surface-variant)">
        <button
          type="button"
          aria-label="Search the web in Chrome"
          onClick={(e) => onOpen("browser", e.currentTarget.parentElement as HTMLElement)}
          className="flex h-full min-w-0 flex-1 items-center gap-3 text-left"
        >
          <GoogleG className="size-6 shrink-0" />
          <span className="truncate text-[16px]">Search</span>
        </button>
        <span aria-hidden className="grid size-10 place-items-center">
          <Mic className="size-5.5" />
        </span>
        <span aria-hidden className="grid size-10 place-items-center">
          <LensMark className="size-5.5" />
        </span>
      </div>
    </div>
  );
}
