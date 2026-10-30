"use client";

import { useSyncExternalStore } from "react";

export type DeviceLayout = "desktop" | "phone";

const PHONE_QUERY = "(max-width: 767px)";
const LANDSCAPE_PHONE_QUERY = "(pointer: coarse) and (max-height: 500px)";

let last: DeviceLayout | null = null;

function subscribe(cb: () => void) {
  const mqs = [matchMedia(PHONE_QUERY), matchMedia(LANDSCAPE_PHONE_QUERY)];
  mqs.forEach((mq) => mq.addEventListener("change", cb));
  return () => mqs.forEach((mq) => mq.removeEventListener("change", cb));
}

function getSnapshot(): DeviceLayout {
  // Tiny viewports (e.g. a devtools pane mid-drag) keep the previous layout.
  if (last && window.innerWidth < 320 && window.innerHeight < 240) return last;
  last =
    matchMedia(PHONE_QUERY).matches || matchMedia(LANDSCAPE_PHONE_QUERY).matches
      ? "phone"
      : "desktop";
  return last;
}

function getServerSnapshot(): DeviceLayout | null {
  return null;
}

/** `null` on the server and during hydration, so only the wallpaper is prerendered. */
export function useDeviceLayout(): DeviceLayout | null {
  return useSyncExternalStore<DeviceLayout | null>(subscribe, getSnapshot, getServerSnapshot);
}
