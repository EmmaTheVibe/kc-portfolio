"use client";

import { Lock } from "lucide-react";
import { profile } from "@/content/profile";
import { BottomBar, NavScreen } from "../../phone/NavStack";
import { openAddress, StartPage } from "./StartPage";

export function BrowserPhone() {
  return (
    <NavScreen
      title="Start Page"
      plain
      bottom={
        <BottomBar className="bg-white/85 dark:bg-[#1c1c1e]/85">
          <form
            className="flex h-11 items-center gap-2 rounded-xl bg-black/[.06] px-3 text-[17px] dark:bg-white/10"
            onSubmit={(e) => {
              e.preventDefault();
              openAddress((e.currentTarget.elements.namedItem("url") as HTMLInputElement).value);
            }}
          >
            <Lock className="size-3.5 shrink-0 opacity-40" />
            <input
              name="url"
              defaultValue={profile.site}
              aria-label="Address"
              enterKeyHint="go"
              placeholder="Search or enter website name"
              className="min-w-0 flex-1 bg-transparent text-center outline-none placeholder:text-black/40 dark:placeholder:text-white/40"
            />
          </form>
        </BottomBar>
      }
    >
      <div className="pt-2 pb-6">
        <StartPage size="phone" />
      </div>
    </NavScreen>
  );
}
