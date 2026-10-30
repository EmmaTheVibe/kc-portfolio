"use client";

import { ChevronLeft, ChevronRight, Lock, RotateCw } from "lucide-react";
import { profile } from "@/content/profile";
import { openAddress, StartPage } from "./StartPage";

const navBtn = "grid size-7 place-items-center rounded-md text-black/30 dark:text-white/30";

export function BrowserDesktop() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex h-11 shrink-0 items-center gap-1 border-b border-black/10 px-3 dark:border-white/10">
        <span className={navBtn} aria-hidden>
          <ChevronLeft className="size-4" />
        </span>
        <span className={navBtn} aria-hidden>
          <ChevronRight className="size-4" />
        </span>
        <form
          className="mx-auto flex h-7 w-full max-w-[460px] items-center gap-1.5 rounded-md bg-black/5 px-2.5 text-[12px] dark:bg-white/10"
          onSubmit={(e) => {
            e.preventDefault();
            openAddress((e.currentTarget.elements.namedItem("url") as HTMLInputElement).value);
          }}
        >
          <Lock className="size-3 shrink-0 opacity-40" />
          <input
            name="url"
            defaultValue={profile.site}
            aria-label="Address"
            placeholder="Search or enter website name"
            onFocus={(e) => e.currentTarget.select()}
            className="min-w-0 flex-1 bg-transparent text-center outline-none placeholder:text-black/40 dark:placeholder:text-white/40"
          />
        </form>
        <span className={navBtn} aria-hidden>
          <RotateCw className="size-3.5" />
        </span>
      </div>
      <div className="os-scroll min-h-0 flex-1 overflow-y-auto bg-white dark:bg-[#1e1e1e]">
        <StartPage size="desktop" />
      </div>
    </div>
  );
}
