"use client";

import { Accessibility, BatteryMedium, Bluetooth, Leaf, Moon, Plane, Settings, Sun, Volume2, Wifi, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/lib/useTheme";
import { Flyout, acrylic } from "./Flyout";

function Tile({ icon: Icon, label, on, onToggle }: { icon: LucideIcon; label: string; on: boolean; onToggle: () => void }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        type="button"
        aria-pressed={on}
        aria-label={label}
        onClick={onToggle}
        className={`grid h-12 w-full place-items-center rounded-md border transition-colors duration-100 ${
          on
            ? "border-transparent bg-[#005fb8] text-white dark:bg-[#60cdff] dark:text-black"
            : "border-black/8 bg-white/70 hover:bg-white dark:border-white/8 dark:bg-white/6 dark:hover:bg-white/10"
        }`}
      >
        <Icon className="size-4" strokeWidth={1.75} />
      </button>
      <span className="w-full truncate text-center text-[12px]">{label}</span>
    </div>
  );
}

function Slider({ icon: Icon, label, initial }: { icon: LucideIcon; label: string; initial: number }) {
  const [value, setValue] = useState(initial);
  return (
    <label className="flex items-center gap-3">
      <Icon className="size-4 shrink-0" strokeWidth={1.75} />
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        aria-label={label}
        onChange={(e) => setValue(Number(e.target.value))}
        className="h-1 w-full accent-[#005fb8] dark:accent-[#60cdff]"
      />
    </label>
  );
}

/** Windows 11 Quick Settings: toggle tiles, brightness and volume, battery. */
export function QuickSettings({ onSettings }: { onSettings: () => void }) {
  const { theme, toggle } = useTheme();
  const [wifi, setWifi] = useState(true);
  const [bt, setBt] = useState(true);
  const [plane, setPlane] = useState(false);
  const [saver, setSaver] = useState(false);
  const [a11y, setA11y] = useState(false);

  return (
    <Flyout label="Quick settings" className="right-3 w-90 max-w-[calc(100vw-24px)]">
      <div className={`overflow-hidden ${acrylic}`}>
        <div className="grid grid-cols-3 gap-x-3 gap-y-4 p-6 pb-5">
          <Tile icon={Wifi} label="Wi‑Fi" on={wifi} onToggle={() => setWifi(!wifi)} />
          <Tile icon={Bluetooth} label="Bluetooth" on={bt} onToggle={() => setBt(!bt)} />
          <Tile icon={Plane} label="Airplane mode" on={plane} onToggle={() => setPlane(!plane)} />
          <Tile icon={Leaf} label="Energy saver" on={saver} onToggle={() => setSaver(!saver)} />
          <Tile icon={Moon} label="Dark mode" on={theme === "dark"} onToggle={toggle} />
          <Tile icon={Accessibility} label="Accessibility" on={a11y} onToggle={() => setA11y(!a11y)} />
        </div>
        <div className="space-y-5 px-6 pb-6">
          <Slider icon={Sun} label="Brightness" initial={80} />
          <Slider icon={Volume2} label="Volume" initial={55} />
        </div>
        <div className="flex h-12 items-center justify-between border-t border-black/8 bg-black/3 px-4 text-[12px] dark:border-white/8 dark:bg-black/20">
          <span className="flex items-center gap-2">
            <BatteryMedium className="size-4.5" strokeWidth={1.75} /> 87%
          </span>
          <button
            type="button"
            aria-label="All settings"
            onClick={onSettings}
            className="grid size-8 place-items-center rounded-md hover:bg-black/5 dark:hover:bg-white/8"
          >
            <Settings className="size-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </Flyout>
  );
}
