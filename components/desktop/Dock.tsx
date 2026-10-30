"use client";

import { motion, useMotionValue } from "motion/react";
import { useRef, useState } from "react";
import { desktopDock, iconLabels, type AppId } from "@/lib/apps";
import { DockIcon } from "./DockIcon";

type Props = {
  isRunning: (id: AppId) => boolean;
  onOpen: (id: AppId) => void;
};

export function Dock({ isRunning, onOpen }: Props) {
  const mouseX = useMotionValue(Infinity);
  const tipX = useMotionValue(0);
  const [tip, setTip] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  function onHover(label: string, el: HTMLElement) {
    const wrap = wrapRef.current?.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    if (wrap) tipX.set(r.left + r.width / 2 - wrap.left);
    if (tip !== label) setTip(label);
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-2 z-[8000] flex justify-center">
      <div ref={wrapRef} className="relative max-w-[96vw]">
        {tip && (
          <motion.div
            className="absolute bottom-[calc(100%+10px)] -translate-x-1/2 whitespace-nowrap rounded-md border border-black/10 bg-window/90 px-2 py-0.5 text-[12px] text-black/80 shadow-popover backdrop-blur-xl dark:border-white/10 dark:bg-window-dark/90 dark:text-white/85"
            style={{ left: tipX }}
          >
            {tip}
          </motion.div>
        )}
        <motion.div
          className="no-scrollbar pointer-events-auto flex max-w-[96vw] items-end gap-2 overflow-x-auto rounded-dock border border-white/40 bg-white/30 px-2.5 pt-2 pb-1.5 shadow-dock backdrop-blur-2xl dark:border-white/15 dark:bg-dock-dark/40"
          onMouseMove={(e) => mouseX.set(e.clientX)}
          onMouseLeave={() => {
            mouseX.set(Infinity);
            setTip(null);
          }}
        >
          {desktopDock.map((item, i) => {
            if (item.kind === "divider") {
              return <div key={`d${i}`} className="mx-0.5 mb-2.5 h-12 w-px shrink-0 self-end bg-black/15 dark:bg-white/20" />;
            }
            if (item.kind === "deco") {
              return (
                <DockIcon
                  key={item.icon}
                  icon={item.icon}
                  label={iconLabels[item.icon]}
                  running={false}
                  mouseX={mouseX}
                  onHover={onHover}
                />
              );
            }
            return (
              <DockIcon
                key={item.id}
                icon={item.id}
                appId={item.id}
                label={iconLabels[item.id]}
                running={isRunning(item.id)}
                mouseX={mouseX}
                onClick={() => onOpen(item.id)}
                onHover={onHover}
              />
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
