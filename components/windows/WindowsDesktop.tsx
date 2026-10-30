"use client";

import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import type { AppId } from "@/lib/apps";
import { minimizeDelta } from "@/lib/iconRegistry";
import { useWindowManager } from "@/lib/useWindowManager";
import { StickyBoard } from "../apps/win/stickies/StickyBoard";
import { WindowLayer } from "../desktop/WindowLayer";
import { CalendarFlyout } from "./CalendarFlyout";
import { QuickSettings } from "./QuickSettings";
import { StartMenu } from "./StartMenu";
import { Taskbar, type Panel } from "./Taskbar";

export function WindowsDesktop({ onLock }: { onLock: () => void }) {
  const wm = useWindowManager("windows");
  const [panel, setPanel] = useState<Panel | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanel(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const launch = (id: AppId) => {
    setPanel(null);
    wm.open(id);
  };

  // Like Windows: clicking the frontmost app's button minimises it; otherwise it opens or comes forward.
  const onAppClick = (id: AppId) => {
    setPanel(null);
    const w = wm.wins[id];
    if (w.open && !w.minimized && wm.activeId === id) wm.minimize(id, minimizeDelta(id));
    else wm.open(id);
  };

  return (
    <div className="relative flex h-full w-full select-none flex-col overflow-hidden">
      <div className="relative min-h-0 flex-1">
        <StickyBoard desk={wm.desk} onOpenList={() => launch("notes")} />
        <WindowLayer wm={wm} skin="windows" />
      </div>

      {panel && <div className="fixed inset-x-0 top-0 bottom-12 z-9001" onPointerDown={() => setPanel(null)} />}
      <AnimatePresence>
        {panel === "start" && (
          <StartMenu
            key="start"
            onLaunch={launch}
            onLock={() => {
              setPanel(null);
              onLock();
            }}
          />
        )}
        {panel === "quick" && <QuickSettings key="quick" onSettings={() => launch("settings")} />}
        {panel === "calendar" && <CalendarFlyout key="calendar" />}
      </AnimatePresence>

      <Taskbar
        panel={panel}
        onToggle={(p) => setPanel((cur) => (cur === p ? null : p))}
        isRunning={(id) => wm.wins[id].open}
        activeId={wm.activeId}
        onAppClick={onAppClick}
      />
    </div>
  );
}
