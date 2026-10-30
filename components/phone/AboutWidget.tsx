import { MapPin } from "lucide-react";
import { profile } from "@/content/profile";

/** 2×2 home-screen widget. Tapping it opens Notes on the intro note. */
export function AboutWidget({ onOpen }: { onOpen: (el: HTMLElement) => void }) {
  return (
    <div className="col-span-2 row-span-2 flex flex-col items-center gap-1.5">
      <button
        type="button"
        onClick={(e) => onOpen(e.currentTarget)}
        className="flex w-full flex-1 flex-col justify-between rounded-[22px] border border-white/30 bg-white/25 p-3.5 text-left text-white shadow-lg backdrop-blur-2xl active:scale-[.97] dark:bg-black/25"
      >
        <span className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-[#a78bfa] to-[#ec4899] text-[16px] font-semibold">
          {profile.initials}
        </span>
        <span>
          <span className="block truncate text-[15px] leading-tight font-semibold">{profile.fullName}</span>
          <span className="block truncate text-[12px] opacity-85">{profile.role}</span>
          <span className="mt-1 flex items-center gap-1 text-[11px] opacity-75">
            <MapPin className="size-3" /> {profile.location}
          </span>
          <span className="mt-1.5 inline-block rounded-full bg-[#34c759] px-2 py-px text-[10px] font-semibold">
            {profile.status}
          </span>
        </span>
      </button>
      <span className="text-[11px] leading-[13px] text-white [text-shadow:0_1px_2px_rgba(0,0,0,.4)]">About</span>
    </div>
  );
}
