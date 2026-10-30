"use client";

import { Bluetooth, Moon, SunMedium, Volume2, Wifi, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { popoverPanel } from "./StatusPopover";

function Tile({ icon: Icon, label, on, onToggle }: { icon: LucideIcon; label: string; on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      className="flex flex-col items-center gap-1 rounded-xl bg-black/5 px-1 py-2 dark:bg-white/10"
    >
      <span
        className={`grid size-7 place-items-center rounded-full transition-colors duration-150 ${
          on ? "bg-accent text-white" : "bg-black/15 text-black/60 dark:bg-white/20 dark:text-white/70"
        }`}
      >
        <Icon className="size-3.5" strokeWidth={2.5} />
      </span>
      <span className="text-[10px] leading-tight text-black/75 dark:text-white/75">{label}</span>
    </button>
  );
}

function Slider({ icon: Icon, label, initial }: { icon: LucideIcon; label: string; initial: number }) {
  const [value, setValue] = useState(initial);
  return (
    <div className="mt-2 rounded-xl bg-black/5 px-2.5 py-2 dark:bg-white/10">
      <div className="mb-1 text-[11px] font-semibold">{label}</div>
      <label className="flex items-center gap-2">
        <Icon className="size-3.5 shrink-0 opacity-60" />
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          aria-label={label}
          onChange={(e) => setValue(Number(e.target.value))}
          className="h-1 w-full accent-accent"
        />
      </label>
    </div>
  );
}

export function ControlCenter() {
  const [wifi, setWifi] = useState(true);
  const [bt, setBt] = useState(true);
  const [dnd, setDnd] = useState(false);

  return (
    <div className={`fixed right-2 top-[30px] z-[9002] w-[300px] max-w-[calc(100vw-16px)] !rounded-2xl !p-2.5 ${popoverPanel}`}>
      <div className="grid grid-cols-3 gap-2">
        <Tile icon={Wifi} label="Wi‑Fi" on={wifi} onToggle={() => setWifi(!wifi)} />
        <Tile icon={Bluetooth} label="Bluetooth" on={bt} onToggle={() => setBt(!bt)} />
        <Tile icon={Moon} label="Do Not Disturb" on={dnd} onToggle={() => setDnd(!dnd)} />
      </div>
      <Slider icon={SunMedium} label="Display" initial={80} />
      <Slider icon={Volume2} label="Sound" initial={55} />
    </div>
  );
}
