"use client";

import { Check, MonitorSmartphone, Moon, Sun } from "lucide-react";
import type { ReactNode } from "react";
import { profile } from "@/content/profile";
import { desktopSkin, deviceBrand, sameStyle, setBrandChoice, useBrandChoice, type BrandChoice } from "@/lib/platform";
import { useTheme, setTheme, type Theme } from "@/lib/useTheme";
import { SystemMark } from "../../icons/AppIcons";
import { WindowsLogo } from "../../icons/WinIcons";
import { aboutSpecs } from "../AboutWindow";
import { Avatar } from "../shared";

const SKIN_NAMES = { macos: "macOS", windows: "Windows 11" } as const;

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-5">
      <h2 className="mb-1.5 px-1 text-[13px] font-semibold text-black/60 dark:text-white/60">{title}</h2>
      <div className="overflow-hidden rounded-lg border border-black/8 bg-white/75 dark:border-white/8 dark:bg-white/5">
        {children}
      </div>
    </section>
  );
}

function Option({
  selected,
  icon,
  label,
  detail,
  onSelect,
}: {
  selected: boolean;
  icon: ReactNode;
  label: string;
  detail: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className="flex w-full items-center gap-3 border-b border-black/6 px-4 py-2.5 text-left last:border-b-0 hover:bg-black/3 dark:border-white/6 dark:hover:bg-white/5"
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-black/5 dark:bg-white/10">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-medium">{label}</span>
        <span className="block truncate text-[12px] text-black/50 dark:text-white/50">{detail}</span>
      </span>
      {selected && <Check className="size-4 shrink-0 text-accent" strokeWidth={2.5} />}
    </button>
  );
}

export function SettingsDesktop() {
  const { theme } = useTheme();
  const choice = useBrandChoice() ?? "auto";
  const own = SKIN_NAMES[desktopSkin(deviceBrand())];

  const styles: { value: BrandChoice; label: string; detail: string; icon: ReactNode }[] = [
    { value: "auto", label: "Automatic", detail: `Match this device (${own})`, icon: <MonitorSmartphone className="size-4.5" /> },
    { value: "apple", label: "macOS", detail: "Menu bar, Dock and traffic lights", icon: <SystemMark className="size-4" /> },
    { value: "windows", label: "Windows 11", detail: "Taskbar, Start menu and snap-style windows", icon: <WindowsLogo className="size-4" /> },
  ];

  const themes: { value: Theme; label: string; icon: ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun className="size-4.5" /> },
    { value: "dark", label: "Dark", icon: <Moon className="size-4.5" /> },
  ];

  return (
    <div className="os-scroll min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-140 px-6 pt-5 pb-8">
        <div className="mb-6 flex items-center gap-3">
          <Avatar initials={profile.initials} colors={["#a78bfa", "#6d28d9"]} size={52} />
          <div>
            <h1 className="text-[18px] font-semibold">{profile.fullName}</h1>
            <p className="text-[12px] text-black/50 dark:text-white/50">{profile.role}</p>
          </div>
        </div>

        <Card title="Device style">
          <div role="radiogroup" aria-label="Device style">
            {styles.map((s) => (
              <Option
                key={s.value}
                selected={sameStyle(choice, s.value, desktopSkin)}
                icon={s.icon}
                label={s.label}
                detail={s.detail}
                onSelect={() => setBrandChoice(s.value)}
              />
            ))}
          </div>
        </Card>

        <Card title="Appearance">
          <div role="radiogroup" aria-label="Appearance">
            {themes.map((t) => (
              <Option
                key={t.value}
                selected={theme === t.value}
                icon={t.icon}
                label={t.label}
                detail={t.value === "light" ? "Bright windows and panels" : "Easy on the eyes at night"}
                onSelect={() => setTheme(t.value)}
              />
            ))}
          </div>
        </Card>

        <Card title="About">
          <dl className="px-4 py-1.5 text-[13px]">
            {aboutSpecs.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-black/6 py-1.5 last:border-b-0 dark:border-white/6">
                <dt className="text-black/50 dark:text-white/50">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </div>
  );
}
