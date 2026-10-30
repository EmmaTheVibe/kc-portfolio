"use client";

import { useMotionValue, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PhoneAppId } from "@/lib/apps";
import { phoneIcons } from "@/lib/iconRegistry";
import { detectOS } from "@/lib/platform";
import { HOME_ZOOM } from "./AppLayer";

type OpenApp = { id: PhoneAppId; source: HTMLElement; origin: DOMRect; closing: boolean };

/** Which app is open on a phone home screen, and the motion values its zoom shares with the home screen. */
export function usePhoneApp() {
  const [open, setOpen] = useState<OpenApp | null>(null);
  // Whether the current app pushed a history entry that "back" should pop.
  const pushed = useRef(false);

  const progress = useMotionValue(0);
  const lift = useMotionValue(0);
  const homeScale = useTransform(progress, [0, 1], [1, HOME_ZOOM]);
  const homeOpacity = useTransform(() => Math.max(1 - progress.get(), lift.get() * 0.9));

  // While its app is open the real icon is hidden, and AppLayer's copy flies in and out of its
  // spot. Unmounting the layer and showing the icon happen in the same commit, so the hand-off
  // is seamless. The widget stays visible: the copy is an icon, not the widget.
  const hiddenIcon = open && phoneIcons.get(open.id) === open.source ? open.id : null;

  const openApp = (id: PhoneAppId, el: HTMLElement) => {
    if (open) return;
    setOpen({ id, source: el, origin: el.getBoundingClientRect(), closing: false });
    // Android's back button and desktop browsers' Back should close the app, not leave the site. iPhones
    // and iPads skip this: Safari's edge swipe would otherwise act as an in-app back gesture.
    const os = detectOS();
    if (os !== "ios" && os !== "ipados") {
      history.pushState({ kcApp: id }, "");
      pushed.current = true;
    }
  };

  const startClose = useCallback(() => setOpen((o) => (o && !o.closing ? { ...o, closing: true } : o)), []);
  const onClosed = useCallback(() => setOpen(null), []);

  const requestClose = useCallback(() => {
    if (pushed.current) history.back();
    else startClose();
  }, [startClose]);

  useEffect(() => {
    const onPop = () => {
      pushed.current = false;
      startClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("keydown", onKey);
    };
  }, [startClose, requestClose]);

  return { open, openApp, requestClose, onClosed, progress, lift, homeScale, homeOpacity, hiddenIcon };
}
