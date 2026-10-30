"use client";

import { BatteryMedium, ChevronUp, Search, Volume2, Wifi } from "lucide-react";
import { apps, taskbarPins, winLabels, type AppId, type IconId } from "@/lib/apps";
import { dockIcons } from "@/lib/iconRegistry";
import { useNow } from "@/lib/useNow";
import { WinIcon, WindowsLogo } from "../icons/WinIcons";

export type Panel = "start" | "quick" | "calendar";

type Props = {
  panel: Panel | null;
  onToggle: (panel: Panel) => void;
  isRunning: (id: AppId) => boolean;
  activeId: AppId | null;
  onAppClick: (id: AppId) => void;
};

const timeFmt = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });
const dateFmt = new Intl.DateTimeFormat(undefined, { month: "numeric", day: "numeric", year: "numeric" });

const isApp = (id: IconId): id is Exclude<AppId, "about"> => id in apps;

const hover = "transition-colors duration-100 hover:bg-white/60 dark:hover:bg-white/8";
const pressed = "bg-white/60 dark:bg-white/8";

function Tip({ children }: { children: string }) {
  return (
    <span className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-black/10 bg-[#f9f9f9] px-2 py-1 text-[12px] text-black opacity-0 shadow-md transition-opacity delay-0 group-hover:opacity-100 group-hover:delay-500 dark:border-white/10 dark:bg-[#2c2c2c] dark:text-white">
      {children}
    </span>
  );
}

function PinnedIcon({ icon, running, active, onClick }: { icon: IconId; running: boolean; active: boolean; onClick?: () => void }) {
  const appId = isApp(icon) ? icon : null;
  return (
    <button
      type="button"
      aria-label={winLabels[icon]}
      ref={(el) => {
        if (!appId || !el) return;
        dockIcons.set(appId, el);
        return () => {
          dockIcons.delete(appId);
        };
      }}
      onClick={onClick}
      className={`group relative grid size-10 place-items-center rounded-md ${hover} ${active ? pressed : ""} ${onClick ? "" : "cursor-default"}`}
    >
      <WinIcon icon={icon} className="size-6 transition-transform duration-100 group-active:scale-90" />
      <span
        className={`absolute bottom-0.5 h-0.75 rounded-full transition-all duration-200 ${
          active
            ? "w-4 bg-[#005fb8] dark:bg-[#60cdff]"
            : running
              ? "w-1.5 bg-black/45 dark:bg-white/55"
              : "w-0 bg-transparent"
        }`}
      />
      <Tip>{winLabels[icon]}</Tip>
    </button>
  );
}

/** Windows 11 taskbar: centred Start, search and pinned apps; system tray and clock on the right. */
export function Taskbar({ panel, onToggle, isRunning, activeId, onAppClick }: Props) {
  const now = new Date(useNow());

  return (
    <div className="relative z-9000 flex h-12 shrink-0 items-center border-t border-black/8 bg-[#f0f0f0]/85 px-1.5 text-black backdrop-blur-2xl dark:border-white/8 dark:bg-[#1c1c1c]/85 dark:text-white">
      <div className="flex-1 basis-0" />

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          aria-label="Start"
          aria-expanded={panel === "start"}
          onClick={() => onToggle("start")}
          className={`group relative grid size-10 place-items-center rounded-md ${hover} ${panel === "start" ? pressed : ""}`}
        >
          <WindowsLogo className="size-6 transition-transform duration-100 group-active:scale-90" />
          <Tip>Start</Tip>
        </button>
        <button
          type="button"
          aria-label="Search"
          onClick={() => onToggle("start")}
          className={`group relative grid size-10 place-items-center rounded-md ${hover}`}
        >
          <Search className="size-5" strokeWidth={1.75} />
          <Tip>Search</Tip>
        </button>
        {taskbarPins.map((icon) =>
          isApp(icon) ? (
            <PinnedIcon
              key={icon}
              icon={icon}
              running={isRunning(icon)}
              active={activeId === icon}
              onClick={() => onAppClick(icon)}
            />
          ) : (
            <PinnedIcon key={icon} icon={icon} running={false} active={false} />
          ),
        )}
      </div>

      <div className="flex flex-1 basis-0 items-center justify-end gap-0.5 text-[12px]">
        <span className={`hidden h-10 w-7 place-items-center rounded-md min-[900px]:grid ${hover}`} aria-hidden>
          <ChevronUp className="size-4" strokeWidth={1.75} />
        </span>
        <button
          type="button"
          aria-label="Quick settings"
          aria-expanded={panel === "quick"}
          onClick={() => onToggle("quick")}
          className={`flex h-10 items-center gap-2.5 rounded-md px-2.5 ${hover} ${panel === "quick" ? pressed : ""}`}
        >
          <Wifi className="size-4" strokeWidth={1.75} />
          <Volume2 className="size-4" strokeWidth={1.75} />
          <BatteryMedium className="size-4.5" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          aria-label="Date and time"
          aria-expanded={panel === "calendar"}
          onClick={() => onToggle("calendar")}
          className={`flex h-10 flex-col items-end justify-center rounded-md px-2.5 leading-4 tabular-nums ${hover} ${panel === "calendar" ? pressed : ""}`}
        >
          <span>{timeFmt.format(now)}</span>
          <span>{dateFmt.format(now)}</span>
        </button>
      </div>
    </div>
  );
}
