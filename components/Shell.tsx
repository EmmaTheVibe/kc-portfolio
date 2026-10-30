"use client";

import { AnimatePresence, MotionConfig, animate, motion, useMotionValue, useTransform } from "motion/react";
import { useCallback, useState } from "react";
import { desktopSkin, phoneSkin, resolveBrand, useBrandChoice } from "@/lib/platform";
import { useDeviceLayout } from "@/lib/useDeviceLayout";
import { useTheme } from "@/lib/useTheme";
import { AndroidShell } from "./android/AndroidShell";
import { materialTheme } from "./android/materialTheme";
import { Desktop } from "./desktop/Desktop";
import { AndroidLock } from "./lock/AndroidLock";
import { DesktopLock } from "./lock/DesktopLock";
import { PhoneLock } from "./lock/PhoneLock";
import { WindowsLock } from "./lock/WindowsLock";
import { PhoneShell } from "./phone/PhoneShell";
import { Wallpaper } from "./Wallpaper";
import { WindowsDesktop } from "./windows/WindowsDesktop";

const REVEAL_SPRING = { type: "spring", stiffness: 260, damping: 30 } as const;

export function Shell() {
  const layout = useDeviceLayout();
  const choice = useBrandChoice();
  const { theme } = useTheme();
  // Layout (desktop or phone) comes from the screen; brand (Apple, Windows…) from the device or the visitor's pick.
  const brand = choice && resolveBrand(choice);
  const skin = layout && brand ? (layout === "desktop" ? desktopSkin(brand) : phoneSkin(brand)) : null;

  const [locked, setLocked] = useState(true);
  // 0 = locked, 1 = home visible. The phone lock drives it directly while dragging.
  const reveal = useMotionValue(0);
  const homeScale = useTransform(reveal, [0, 1], [1.08, 1]);

  const unlock = useCallback(() => {
    setLocked(false);
    animate(reveal, 1, REVEAL_SPRING);
  }, [reveal]);

  const lock = useCallback(() => {
    setLocked(true);
    animate(reveal, 0, { duration: 0.3, ease: "easeIn" });
  }, [reveal]);

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={`os-root fixed inset-0 touch-manipulation overflow-hidden overscroll-none ${skin ? `skin-${skin}` : ""}`}
        style={skin === "android" ? materialTheme(theme) : undefined}
      >
        <Wallpaper skin={skin} />
        {skin && (
          <motion.div
            key={skin}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div className="absolute inset-0" inert={locked} style={{ scale: homeScale, opacity: reveal }}>
              {skin === "macos" ? (
                <Desktop onLock={lock} />
              ) : skin === "windows" ? (
                <WindowsDesktop onLock={lock} />
              ) : skin === "android" ? (
                <AndroidShell />
              ) : (
                <PhoneShell />
              )}
            </motion.div>
            <AnimatePresence>
              {locked &&
                (skin === "macos" ? (
                  <DesktopLock key="desktop-lock" onUnlock={unlock} />
                ) : skin === "windows" ? (
                  <WindowsLock key="windows-lock" onUnlock={unlock} />
                ) : skin === "android" ? (
                  <AndroidLock key="android-lock" reveal={reveal} onUnlock={unlock} />
                ) : (
                  <PhoneLock key="phone-lock" reveal={reveal} onUnlock={unlock} />
                ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </MotionConfig>
  );
}
