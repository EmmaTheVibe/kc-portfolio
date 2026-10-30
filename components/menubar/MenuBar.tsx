"use client";

import { Moon, SlidersHorizontal, Sun, Wifi } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/lib/useTheme";
import { SystemMark } from "../icons/AppIcons";
import { BatteryGlyph } from "../icons/Glyphs";
import { BatteryPopover } from "./BatteryPopover";
import { Clock } from "./Clock";
import { ControlCenter } from "./ControlCenter";
import { SystemMenu } from "./SystemMenu";
import { WifiPopover } from "./WifiPopover";

type Menu = "system" | "control" | "wifi" | "battery" | null;

const btn = "rounded transition-colors duration-150 hover:bg-black/5 dark:hover:bg-white/10";
const pressed = "bg-black/10 dark:bg-white/15";

export function MenuBar({
  appName,
  onAbout,
  onSettings,
  onLock,
}: {
  appName: string;
  onAbout: () => void;
  onSettings: () => void;
  onLock: () => void;
}) {
  const [menu, setMenu] = useState<Menu>(null);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const hover = (m: Exclude<Menu, null>) => ({
    onMouseEnter: () => setMenu((cur) => (cur === "system" || cur === "control" ? cur : m)),
    onMouseLeave: () => setMenu((cur) => (cur === m ? null : cur)),
  });

  const clickMenuOpen = menu === "system" || menu === "control";

  return (
    <div className="relative z-9000 flex h-7 shrink-0 items-center gap-1 px-2 text-[13px] leading-[19.5px] text-black/85 dark:text-white/90">
      {/* Blur lives on its own layer: backdrop-filter on the bar would trap the fixed click-catcher. */}
      <div className="absolute inset-0 -z-10 bg-white/40 shadow-[0_1px_0_rgba(0,0,0,.06)] backdrop-blur-xl dark:bg-black/30" />

      {clickMenuOpen && <div className="fixed inset-0 z-9001" onPointerDown={() => setMenu(null)} />}

      <div className="relative">
        <button
          type="button"
          aria-label="System menu"
          aria-expanded={menu === "system"}
          onClick={() => setMenu(menu === "system" ? null : "system")}
          className={`relative z-9002 px-2.5 py-0.5 ${btn} ${menu === "system" ? pressed : ""}`}
        >
          <SystemMark className="block size-3.75 -translate-y-px" />
        </button>
        {menu === "system" && (
          <SystemMenu
            onAbout={() => {
              setMenu(null);
              onAbout();
            }}
            onSettings={() => {
              setMenu(null);
              onSettings();
            }}
            onLock={() => {
              setMenu(null);
              onLock();
            }}
          />
        )}
      </div>

      <span className="truncate px-2 font-semibold">{appName}</span>
      <div className="hidden cursor-default lg:flex">
        {["File", "Edit", "View", "Window", "Help"].map((m) => (
          <span key={m} className={`px-2 py-0.5 ${btn}`}>
            {m}
          </span>
        ))}
      </div>

      <div className="flex-1" />

      <button
        type="button"
        onClick={toggle}
        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        className={`px-1.5 py-0.5 ${btn}`}
      >
        {theme === "dark" ? <Moon className="size-3.75" /> : <Sun className="size-3.75" />}
      </button>

      <div className="relative" {...hover("wifi")}>
        <div className={`px-1.5 py-0.5 ${btn} ${menu === "wifi" ? pressed : ""}`} aria-label="Wi‑Fi">
          <Wifi className="size-3.75" />
        </div>
        {menu === "wifi" && <WifiPopover />}
      </div>

      <div className="relative" {...hover("battery")}>
        <div className={`px-1.5 py-0.5 ${btn} ${menu === "battery" ? pressed : ""}`} aria-label="Battery">
          <BatteryGlyph className="h-3.25 w-6.5" />
        </div>
        {menu === "battery" && <BatteryPopover />}
      </div>

      <button
        type="button"
        aria-label="Control Center"
        aria-expanded={menu === "control"}
        onClick={() => setMenu(menu === "control" ? null : "control")}
        className={`relative z-9002 px-1.5 py-0.5 ${btn} ${menu === "control" ? pressed : ""}`}
      >
        <SlidersHorizontal className="size-3.75" />
      </button>
      {menu === "control" && <ControlCenter />}

      <Clock />
    </div>
  );
}
