"use client";

import { useSyncExternalStore } from "react";

export type DeviceOS = "macos" | "ios" | "ipados" | "android" | "windows" | "linux" | "unknown";
/** Which family the UI dresses up as. Desktop and phone layouts each pick their own skin from it. */
export type Brand = "apple" | "windows" | "android";
export type BrandChoice = Brand | "auto";
export type DesktopSkin = "macos" | "windows";
export type PhoneSkin = "ios" | "android";

const KEY = "kc-os:brand";
const listeners = new Set<() => void>();

/** `?os=` values that force a brand, handy for sharing a specific look. */
const ALIASES: Record<string, Brand> = {
  apple: "apple",
  mac: "apple",
  macos: "apple",
  ios: "apple",
  iphone: "apple",
  windows: "windows",
  win: "windows",
  win11: "windows",
  android: "android",
};

const isBrand = (v: unknown): v is Brand => v === "apple" || v === "windows" || v === "android";

export function detectOS(): DeviceOS {
  const ua = navigator.userAgent;
  const hints = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ?? "";
  const touch = navigator.maxTouchPoints > 0;
  if (/android/i.test(ua) || /android/i.test(hints)) return "android";
  if (/iphone|ipod/i.test(ua)) return "ios";
  // iPads ask for desktop sites by default and claim to be Macs; only the touchscreen gives them away.
  if (/ipad/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return "ipados";
  if (/windows/i.test(ua) || /windows/i.test(hints)) return "windows";
  if (/macintosh|mac os x/i.test(ua)) return "macos";
  // Android's "Desktop site" mode reports Linux; a touchscreen plus a coarse pointer is almost always a phone.
  if (/linux|cros/i.test(ua)) return touch && matchMedia("(pointer: coarse)").matches ? "android" : "linux";
  return "unknown";
}

/** The brand this device would get on its own. Anything that isn't Apple or Android looks like Windows. */
export function deviceBrand(): Brand {
  const os = detectOS();
  if (os === "macos" || os === "ios" || os === "ipados") return "apple";
  if (os === "android") return "android";
  return "windows";
}

export const desktopSkin = (b: Brand): DesktopSkin => (b === "apple" ? "macos" : "windows");
/** Phones that aren't Apple's (Windows has no phone any more) look like Android. */
export const phoneSkin = (b: Brand): PhoneSkin => (b === "apple" ? "ios" : "android");

/**
 * Whether a style option shows as picked. A brand the current layout can't wear counts as the skin
 * it lands on: "windows", chosen on a desktop, shows as Android on a phone.
 */
export const sameStyle = (choice: BrandChoice, option: BrandChoice, skinOf: (b: Brand) => string) =>
  choice === "auto" || option === "auto" ? choice === option : skinOf(choice) === skinOf(option);

function readChoice(): BrandChoice {
  const q = new URLSearchParams(location.search).get("os")?.toLowerCase();
  if (q && ALIASES[q]) return ALIASES[q];
  try {
    const saved = localStorage.getItem(KEY);
    return isBrand(saved) ? saved : "auto";
  } catch {
    return "auto";
  }
}

export function setBrandChoice(choice: BrandChoice) {
  try {
    if (choice === "auto") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, choice);
  } catch {}
  // A picked style beats whatever ?os= the visit started with.
  const url = new URL(location.href);
  if (url.searchParams.has("os")) {
    url.searchParams.delete("os");
    history.replaceState(history.state, "", url);
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** The visitor's chosen style, or "auto". `null` on the server and during hydration. */
export function useBrandChoice(): BrandChoice | null {
  return useSyncExternalStore<BrandChoice | null>(subscribe, readChoice, () => null);
}

export const resolveBrand = (choice: BrandChoice): Brand => (choice === "auto" ? deviceBrand() : choice);
