"use client";

import { motion } from "motion/react";
import { renderAndroidView } from "../apps/android/views";
import { AndroidIcon } from "../icons/AndroidIcons";
import { AppLayer } from "../phone/AppLayer";
import { usePhoneApp } from "../phone/usePhoneApp";
import { AndroidHome } from "./AndroidHome";
import { ANavBar, AStatusBar } from "./SystemBars";

/** The Android phone: Pixel home screen, Google's apps, and the three-button nav bar. */
export function AndroidShell() {
  const { open, openApp, requestClose, onClosed, progress, lift, homeScale, homeOpacity, hiddenIcon } = usePhoneApp();
  const inApp = !!open && !open.closing;

  return (
    <div className="fixed inset-0 select-none overflow-hidden overscroll-none">
      <motion.div
        className="absolute inset-0"
        style={{ scale: homeScale, opacity: homeOpacity, pointerEvents: open ? "none" : "auto" }}
      >
        <AndroidHome onOpen={openApp} hiddenIcon={hiddenIcon} />
      </motion.div>

      {open && (
        <AppLayer
          key={open.id}
          id={open.id}
          source={open.source}
          origin={open.origin}
          closing={open.closing}
          progress={progress}
          lift={lift}
          onRequestClose={requestClose}
          onClosed={onClosed}
          icon={<AndroidIcon icon={open.id} cover className="block size-full" />}
          iconRadius={0.5}
          homeBar={false}
        >
          {renderAndroidView(open.id)}
        </AppLayer>
      )}

      <AStatusBar inApp={inApp} />
      <ANavBar inApp={inApp} onHome={() => open && requestClose()} />
    </div>
  );
}
