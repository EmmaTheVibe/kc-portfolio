"use client";

import { Wifi } from "lucide-react";
import { useNow } from "@/lib/useNow";
import { clockTime } from "@/lib/time";
import { BatteryGlyph, SignalGlyph } from "../icons/Glyphs";
import { STATUS_H } from "./NavStack";

/** `label` replaces the clock on the left, as the lock screen shows the carrier there instead. */
export function StatusBar({ inApp, label }: { inApp: boolean; label?: string }) {
  const time = clockTime(useNow());

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between px-7 transition-colors duration-200 ${
        inApp ? "text-black dark:text-white" : "text-white"
      }`}
      style={{ height: STATUS_H }}
    >
      <span className="text-[15px] font-semibold tabular-nums">{label ?? time}</span>
      <span className="flex items-center gap-1.5">
        <SignalGlyph className="h-2.75 w-4.25" />
        <Wifi className="size-4" strokeWidth={2.5} />
        <BatteryGlyph className="h-3 w-6.25" />
      </span>
    </div>
  );
}
