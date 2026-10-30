"use client";

import { Info, MonitorSmartphone, Palette, Search, type LucideIcon } from "lucide-react";
import { profile } from "@/content/profile";
import { deviceBrand, phoneSkin, sameStyle, setBrandChoice, useBrandChoice, type BrandChoice } from "@/lib/platform";
import { setTheme, useTheme } from "@/lib/useTheme";
import { AScreen, AStack, ListItem, Radio, Switch } from "../../android/Material";
import { aboutSpecs } from "../AboutWindow";
import { Avatar } from "../shared";

const SKIN_NAMES = { ios: "iOS", android: "Android" } as const;
type Page = "root" | "style" | "display" | "about";

/** Settings' tonal icon circle. */
function Glyph({ icon: Icon, color }: { icon: LucideIcon; color: string }) {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-full text-white" style={{ background: color }}>
      <Icon className="size-5" />
    </span>
  );
}

/** Android Settings: a search bar, the account card, then pages for device style, display and About phone. */
export function SettingsAndroid() {
  const { theme } = useTheme();
  const choice = useBrandChoice() ?? "auto";
  const own = SKIN_NAMES[phoneSkin(deviceBrand())];

  const styles: { value: BrandChoice; label: string; detail: string }[] = [
    { value: "auto", label: "Automatic", detail: `Match this device (${own})` },
    { value: "apple", label: "iOS", detail: "Home screen, Dock and swipe-up home bar" },
    { value: "android", label: "Android", detail: "Material You, Google apps and the nav bar" },
  ];
  const current = styles.find((s) => sameStyle(choice, s.value, phoneSkin)) ?? styles[0];

  return (
    <AStack<Page>
      root="root"
      render={(page, nav) => {
        if (page === "style") {
          return (
            <AScreen title="Device style" onBack={nav.pop}>
              <p className="px-4 pb-2 text-[14px] text-(--md-on-surface-variant)">Which phone this site dresses up as.</p>
              {styles.map((s) => (
                <ListItem
                  key={s.value}
                  leading={<Radio checked={s === current} />}
                  headline={s.label}
                  supporting={s.detail}
                  onClick={() => setBrandChoice(s.value)}
                />
              ))}
            </AScreen>
          );
        }
        if (page === "display") {
          return (
            <AScreen title="Display" onBack={nav.pop}>
              <ListItem
                headline="Dark theme"
                supporting="Uses a dark background to help keep your eyes comfortable"
                trailing={<Switch label="Dark theme" checked={theme === "dark"} onChange={(on) => setTheme(on ? "dark" : "light")} />}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              />
            </AScreen>
          );
        }
        if (page === "about") {
          return (
            <AScreen title="About phone" onBack={nav.pop}>
              <div className="flex flex-col items-center px-4 pt-4 pb-6">
                <Avatar initials={profile.initials} colors={["#a78bfa", "#6d28d9"]} size={72} />
                <p className="mt-3 text-[22px]">{profile.name}&apos;s Pixel</p>
              </div>
              <ListItem headline="Device name" supporting={`${profile.name}'s Pixel`} />
              {aboutSpecs.map(([k, v]) => (
                <ListItem key={k} headline={k} supporting={v} />
              ))}
            </AScreen>
          );
        }
        return (
          <AScreen
            header={
              <>
                <h1 className="px-6 pt-10 pb-6 text-[36px] leading-11">Settings</h1>
                <div className="mx-4 mb-3 flex h-14 items-center gap-1 rounded-full bg-(--md-surface-container-high) pr-2 pl-1 text-(--md-on-surface-variant)">
                  <span className="grid size-12 place-items-center">
                    <Search className="size-6" />
                  </span>
                  <span className="flex-1 text-[16px]">Search Settings</span>
                  <Avatar initials={profile.initials} colors={["#a78bfa", "#6d28d9"]} size={32} />
                </div>
              </>
            }
          >
            <div className="mx-4 mb-3 flex items-center gap-4 rounded-3xl bg-(--md-primary-container) p-4 text-(--md-on-primary-container)">
              <Avatar initials={profile.initials} colors={["#a78bfa", "#6d28d9"]} size={48} />
              <div className="min-w-0">
                <p className="truncate text-[18px]">{profile.fullName}</p>
                <p className="truncate text-[14px] opacity-80">{profile.role}</p>
              </div>
            </div>
            <ListItem leading={<Glyph icon={MonitorSmartphone} color="#1a73e8" />} headline="Device style" supporting={current.label} onClick={() => nav.push("style")} />
            <ListItem leading={<Glyph icon={Palette} color="#e37400" />} headline="Display" supporting={`Dark theme ${theme === "dark" ? "on" : "off"}`} onClick={() => nav.push("display")} />
            <ListItem leading={<Glyph icon={Info} color="#5f6368" />} headline="About phone" supporting={`${profile.name}'s Pixel`} onClick={() => nav.push("about")} />
          </AScreen>
        );
      }}
    />
  );
}
