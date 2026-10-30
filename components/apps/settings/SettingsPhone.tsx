"use client";

import { Check } from "lucide-react";
import { profile } from "@/content/profile";
import { deviceBrand, phoneSkin, sameStyle, setBrandChoice, useBrandChoice, type BrandChoice } from "@/lib/platform";
import { useTheme, setTheme } from "@/lib/useTheme";
import { GroupedRow, GroupedSection, Segmented } from "../../phone/Grouped";
import { NavScreen, NavStack } from "../../phone/NavStack";
import { aboutSpecs } from "../AboutWindow";
import { Avatar } from "../shared";

const THEMES = ["Light", "Dark"] as const;
const SKIN_NAMES = { ios: "iOS", android: "Android" } as const;

export function SettingsPhone() {
  const { theme } = useTheme();
  const choice = useBrandChoice() ?? "auto";
  const styles: { value: BrandChoice; label: string }[] = [
    { value: "auto", label: `Automatic (${SKIN_NAMES[phoneSkin(deviceBrand())]})` },
    { value: "apple", label: "iOS" },
    { value: "android", label: "Android" },
  ];

  return (
    <NavStack<"root">
      root="root"
      renderScreen={() => (
        <NavScreen title="Settings" largeTitle>
          <GroupedSection>
            <GroupedRow chevron={false} leading={<Avatar initials={profile.initials} colors={["#a78bfa", "#6d28d9"]} size={52} />}>
              <div className="truncate text-[20px] leading-6 font-semibold">{profile.fullName}</div>
              <div className="truncate text-[13px] text-black/50 dark:text-white/55">{profile.role}</div>
            </GroupedRow>
          </GroupedSection>

          <GroupedSection title="Device Style">
            {styles.map((s) => (
              <GroupedRow key={s.value} chevron={false} onClick={() => setBrandChoice(s.value)}>
                <div className="flex items-center justify-between gap-4 text-[17px]">
                  <span>{s.label}</span>
                  {sameStyle(choice, s.value, phoneSkin) && <Check className="size-5 text-accent" strokeWidth={2.5} />}
                </div>
              </GroupedRow>
            ))}
          </GroupedSection>

          <GroupedSection title="Appearance">
            <div className="p-3">
              <Segmented
                options={THEMES}
                value={theme === "dark" ? "Dark" : "Light"}
                onChange={(v) => setTheme(v === "Dark" ? "dark" : "light")}
              />
            </div>
          </GroupedSection>

          <GroupedSection title="About">
            {aboutSpecs.map(([k, v]) => (
              <GroupedRow key={k} chevron={false}>
                <div className="flex justify-between gap-4 text-[17px]">
                  <span>{k}</span>
                  <span className="text-black/50 dark:text-white/55">{v}</span>
                </div>
              </GroupedRow>
            ))}
          </GroupedSection>
        </NavScreen>
      )}
    />
  );
}
