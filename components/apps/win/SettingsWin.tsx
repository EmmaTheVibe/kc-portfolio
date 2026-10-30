"use client";

import { Info, MonitorSmartphone, Paintbrush, Search, SunMoon, type LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { profile } from "@/content/profile";
import { desktopSkin, deviceBrand, setBrandChoice, useBrandChoice, type BrandChoice } from "@/lib/platform";
import { setTheme, useTheme, type Theme } from "@/lib/useTheme";
import { aboutSpecs } from "../AboutWindow";
import { Avatar } from "../shared";

type Page = "Personalization" | "About";

const pages: { id: Page; icon: LucideIcon; color: string }[] = [
  { id: "Personalization", icon: Paintbrush, color: "#e3008c" },
  { id: "About", icon: Info, color: "#0078d4" },
];

const SKIN_NAMES = { macos: "macOS", windows: "Windows 11" } as const;

function Row({ icon: Icon, title, detail, children }: { icon: LucideIcon; title: string; detail: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-4 rounded-md border border-black/6 bg-white px-4 py-3.5 dark:border-white/6 dark:bg-[#2b2b2b]">
      <Icon className="size-5 shrink-0" strokeWidth={1.6} />
      <div className="min-w-0 flex-1">
        <p className="text-[13px]">{title}</p>
        <p className="text-[12px] text-black/55 dark:text-white/55">{detail}</p>
      </div>
      {children}
    </div>
  );
}

function Select<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="h-8 min-w-36 rounded-md border border-black/10 bg-[#fbfbfb] px-2 text-[13px] dark:border-white/10 dark:bg-[#373737]"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/** Windows 11 Settings: account header and nav on the left, cards of rows on the right. */
export function SettingsWin() {
  const [page, setPage] = useState<Page>("Personalization");
  const { theme } = useTheme();
  const choice = useBrandChoice() ?? "auto";
  const own = SKIN_NAMES[desktopSkin(deviceBrand())];

  return (
    <div className="flex min-h-0 flex-1 bg-[#f3f3f3] dark:bg-[#202020]">
      <aside className="flex w-64 shrink-0 flex-col px-3 pt-2 @max-xl:w-16 @max-xl:px-2">
        <div className="mb-4 flex items-center gap-3 px-1 @max-xl:justify-center">
          <Avatar initials={profile.initials} colors={["#a78bfa", "#6d28d9"]} size={56} />
          <div className="min-w-0 @max-xl:hidden">
            <p className="truncate text-[14px] font-semibold">{profile.fullName}</p>
            <p className="truncate text-[12px] text-black/55 dark:text-white/55">Local account</p>
          </div>
        </div>
        <span className="mb-3 flex h-8 items-center gap-2 rounded-md border border-black/8 bg-white px-2.5 text-[13px] text-black/50 @max-xl:hidden dark:border-white/8 dark:bg-white/5 dark:text-white/50">
          Find a setting <Search className="ml-auto size-3.5" />
        </span>
        {pages.map(({ id, icon: Icon, color }) => (
          <button
            key={id}
            type="button"
            title={id}
            onClick={() => setPage(id)}
            className={`relative flex items-center gap-3 rounded-md px-3 py-2 text-left text-[13px] @max-xl:justify-center ${
              id === page ? "bg-black/5 dark:bg-white/8" : "hover:bg-black/4 dark:hover:bg-white/5"
            }`}
          >
            {id === page && <span className="absolute top-2.5 bottom-2.5 left-0 w-0.75 rounded-full bg-[#005fb8] dark:bg-[#60cdff]" />}
            <Icon className="size-4 shrink-0" style={{ color }} />
            <span className="@max-xl:hidden">{id}</span>
          </button>
        ))}
      </aside>

      <section className="os-scroll min-w-0 flex-1 overflow-y-auto px-8 pt-2 pb-8">
        <h1 className="mb-5 text-[26px] font-semibold">{page}</h1>
        {page === "Personalization" ? (
          <div className="space-y-1">
            <Row icon={MonitorSmartphone} title="Device style" detail={`Which operating system this site dresses up as. Automatic matches this device (${own}).`}>
              <Select<BrandChoice>
                label="Device style"
                value={choice === "android" ? "windows" : choice}
                onChange={setBrandChoice}
                options={[
                  { value: "auto", label: "Automatic" },
                  { value: "apple", label: "macOS" },
                  { value: "windows", label: "Windows 11" },
                ]}
              />
            </Row>
            <Row icon={SunMoon} title="Choose your mode" detail="Change the colours that appear in windows and the taskbar">
              <Select<Theme>
                label="Mode"
                value={theme}
                onChange={setTheme}
                options={[
                  { value: "light", label: "Light" },
                  { value: "dark", label: "Dark" },
                ]}
              />
            </Row>
          </div>
        ) : (
          <div className="rounded-md border border-black/6 bg-white px-4 py-2 dark:border-white/6 dark:bg-[#2b2b2b]">
            <p className="py-2 text-[14px] font-semibold">Site specifications</p>
            <dl className="text-[13px]">
              {aboutSpecs.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[10rem_1fr] gap-4 py-1.5">
                  <dt className="text-black/55 dark:text-white/55">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <p className="pt-2 pb-2 text-[12px] text-black/55 dark:text-white/55">Designed and built by {profile.fullName}.</p>
          </div>
        )}
      </section>
    </div>
  );
}
