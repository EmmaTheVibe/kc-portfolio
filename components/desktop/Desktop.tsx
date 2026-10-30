"use client";

import { apps } from "@/lib/apps";
import { useWindowManager } from "@/lib/useWindowManager";
import { MenuBar } from "../menubar/MenuBar";
import { CalendarWidget } from "./CalendarWidget";
import { Dock } from "./Dock";
import { WindowLayer } from "./WindowLayer";

export function Desktop({ onLock }: { onLock: () => void }) {
  const wm = useWindowManager("macos");

  return (
    <div className="relative flex h-full w-full select-none flex-col overflow-hidden">
      <MenuBar
        appName={wm.activeId ? apps[wm.activeId].menuName : "Desktop"}
        onAbout={() => wm.open("about")}
        onSettings={() => wm.open("settings")}
        onLock={onLock}
      />
      <div className="relative min-h-0 flex-1">
        <CalendarWidget className="absolute top-4 right-4" />
        <WindowLayer wm={wm} skin="macos" />
      </div>
      <Dock isRunning={(id) => wm.wins[id].open} onOpen={wm.open} />
    </div>
  );
}
