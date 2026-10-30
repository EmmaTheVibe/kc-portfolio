"use client";

import { AnimatePresence } from "motion/react";
import { appIds, appTitle, windowConfig } from "@/lib/apps";
import type { DesktopSkin } from "@/lib/platform";
import type { useWindowManager } from "@/lib/useWindowManager";
import { renderDesktopView } from "../apps/views";
import { renderWindowsView } from "../apps/win/views";
import { Window } from "./Window";

/** Every open window, dressed for the current skin and running that platform's version of each app. */
export function WindowLayer({ wm, skin }: { wm: ReturnType<typeof useWindowManager>; skin: DesktopSkin }) {
  return (
    <AnimatePresence>
      {appIds
        .filter((id) => wm.wins[id].open)
        .map((id) => {
          const cfg = windowConfig(id, skin);
          const w = wm.wins[id];
          return (
            <Window
              key={id}
              id={id}
              title={appTitle(id, skin)}
              skin={skin}
              icon={id === "about" ? undefined : id}
              geom={w.geom}
              min={cfg.min}
              desk={wm.desk}
              resizable={cfg.resizable}
              maximizable={cfg.maximizable}
              maximized={w.maximized}
              minimized={w.minimized}
              minimizeDelta={w.delta}
              zIndex={10 + w.z}
              focused={id === wm.activeId}
              onClose={() => wm.close(id)}
              onMinimize={(delta) => wm.minimize(id, delta)}
              onToggleMaximize={() => wm.toggleMaximize(id)}
              onFocus={() => wm.focus(id)}
              onGeomChange={(g) => wm.setGeom(id, g)}
            >
              {skin === "windows" ? renderWindowsView(id) : renderDesktopView(id)}
            </Window>
          );
        })}
    </AnimatePresence>
  );
}
