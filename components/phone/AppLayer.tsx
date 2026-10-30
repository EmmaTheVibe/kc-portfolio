"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import type { IconId } from "@/lib/apps";
import { clamp, lerp } from "@/lib/geometry";
import { AppIcon } from "../icons/AppIcons";
import { HomeIndicator } from "./HomeIndicator";
import { HomeContext } from "./NavStack";

export const OPEN_SPRING = { type: "spring", stiffness: 300, damping: 30 } as const;
// Critically damped, so the copy never shrinks past the real icon before handing over to it.
const CLOSE_SPRING = { type: "spring", stiffness: 320, damping: 36, restDelta: 0.002 } as const;
const DEVICE_RADIUS = 40;
// Matches AppIcon's squircle (rx 115 on a 512 canvas), so the clip hides behind the copy exactly.
const ICON_RADIUS = 115 / 512;

/** How far the home screen zooms out while an app is open. */
export const HOME_ZOOM = 0.92;
const homeScaleAt = (p: number) => lerp(1, HOME_ZOOM, clamp(p, 0, 1));

type Props = {
  id: IconId;
  /** What the app opened from (an icon or the widget); it closes back into it. */
  source: HTMLElement;
  origin: DOMRect;
  closing: boolean;
  /** 0 = icon, 1 = full screen. Shared with the home screen, which scales against it. */
  progress: MotionValue<number>;
  /** 0–1 while the app is dragged up, so the home screen can peek through. */
  lift: MotionValue<number>;
  onRequestClose: () => void;
  onClosed: () => void;
  /** The flying icon copy, drawn with `cover`. Defaults to the iOS icon. */
  icon?: ReactNode;
  /** Corner radius of the icon as a fraction of its width (0.5 for a circle). */
  iconRadius?: number;
  /** iOS's home bar, which closes the app with a swipe or tap. Android uses its nav bar instead. */
  homeBar?: boolean;
  children: ReactNode;
};

/**
 * A full-screen app that zooms out of its icon. The visible area is a clip-path
 * that grows from the icon rect, so the content is never stretched.
 */
export function AppLayer({
  id,
  source,
  origin,
  closing,
  progress,
  lift,
  onRequestClose,
  onClosed,
  icon,
  iconRadius = ICON_RADIUS,
  homeBar = true,
  children,
}: Props) {
  const reduce = useReducedMotion();
  const [screen, setScreen] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));

  const ol = useMotionValue(origin.left);
  const ot = useMotionValue(origin.top);
  const ow = useMotionValue(origin.width);
  const oh = useMotionValue(origin.height);
  const dragY = useMotionValue(0);

  useEffect(() => {
    const onResize = () => setScreen({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (closing) return;
    const c = animate(progress, 1, reduce ? { duration: 0 } : OPEN_SPRING);
    return () => c.stop();
  }, [closing, progress, reduce]);

  useEffect(() => {
    if (!closing) return;
    // The icon may have moved (page swipe, rotation), so aim at where it is now. The home
    // screen is still zoomed out behind the app; undo that so we land where the icon will rest.
    const r = source.getBoundingClientRect();
    const s = homeScaleAt(progress.get());
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    ol.set(cx + (r.left - cx) / s);
    ot.set(cy + (r.top - cy) / s);
    ow.set(r.width / s);
    oh.set(r.height / s);
    const t = reduce ? { duration: 0 } : CLOSE_SPRING;
    const cs = [animate(dragY, 0, t), animate(lift, 0, t), animate(progress, 0, { ...t, onComplete: onClosed })];
    return () => cs.forEach((c) => c.stop());
  }, [closing, source, reduce, onClosed, ol, ot, ow, oh, dragY, lift, progress]);

  const rect = () => {
    const p = clamp(progress.get(), 0, 1);
    return {
      p,
      l: lerp(ol.get(), 0, p),
      t: lerp(ot.get(), 0, p),
      w: lerp(ow.get(), screen.w, p),
      h: lerp(oh.get(), screen.h, p),
    };
  };

  const clipPath = useTransform(() => {
    const { p, l, t, w, h } = rect();
    const dragRadius = clamp(-dragY.get() / 200, 0, 1) * DEVICE_RADIUS;
    if (p >= 0.999 && dragRadius === 0) return "none";
    const radius = Math.max(lerp(ow.get() * iconRadius, DEVICE_RADIUS, p), dragRadius);
    return `inset(${t}px ${screen.w - l - w}px ${screen.h - t - h}px ${l}px round ${radius}px)`;
  });
  const dragScale = useTransform(dragY, [-screen.h * 0.5, 0], [0.85, 1]);

  // Content is scaled uniformly and centred on the growing clip rect.
  const contentScale = useTransform(() => lerp(ow.get() / screen.w, 1, clamp(progress.get(), 0, 1)));
  const contentX = useTransform(() => {
    const { l, w } = rect();
    return l + w / 2 - screen.w / 2;
  });
  const contentY = useTransform(() => {
    const { t, h } = rect();
    return t + h / 2 - screen.h / 2;
  });
  // Staggered so the window's own background never shows through: the content is fully opaque
  // whenever the icon is fading, and the icon is fully opaque whenever the content is.
  const contentOpacity = useTransform(progress, [0.02, 0.1], [0, 1]);

  // The icon copy fills the whole clip rect (not just a centred square), so it covers the
  // window at every aspect ratio and becomes the exact icon once the rect is square.
  const iconOpacity = useTransform(progress, [0.12, 0.4], [1, 0]);
  const iconLeft = useTransform(() => rect().l);
  const iconTop = useTransform(() => rect().t);
  const iconWidth = useTransform(() => rect().w);
  const iconHeight = useTransform(() => rect().h);

  return (
    <motion.div
      className="fixed inset-0 z-30 overflow-hidden bg-white dark:bg-black"
      style={{ clipPath, y: dragY, scale: dragScale }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ scale: contentScale, x: contentX, y: contentY, opacity: contentOpacity }}
      >
        <HomeContext.Provider value={onRequestClose}>{children}</HomeContext.Provider>
      </motion.div>
      <motion.div
        className="pointer-events-none absolute"
        style={{ left: iconLeft, top: iconTop, width: iconWidth, height: iconHeight, opacity: iconOpacity }}
      >
        {icon ?? <AppIcon icon={id} cover className="block size-full" />}
      </motion.div>
      {homeBar && !closing && (
        <HomeIndicator
          onDrag={(dy) => {
            dragY.set(dy);
            lift.set(clamp(-dy / 300, 0, 1));
          }}
          onRelease={(close) => {
            if (close) return onRequestClose();
            const t = reduce ? { duration: 0 } : OPEN_SPRING;
            animate(dragY, 0, t);
            animate(lift, 0, t);
          }}
        />
      )}
    </motion.div>
  );
}
