"use client";

import { motion } from "motion/react";
import { renderPhoneView } from "../apps/views";
import { AppLayer } from "./AppLayer";
import { HomeGrid } from "./HomeGrid";
import { STATUS_H } from "./NavStack";
import { PhoneDock } from "./PhoneDock";
import { StatusBar } from "./StatusBar";
import { usePhoneApp } from "./usePhoneApp";

export function PhoneShell() {
  const { open, openApp, requestClose, onClosed, progress, lift, homeScale, homeOpacity, hiddenIcon } = usePhoneApp();

  return (
    <div className="fixed inset-0 select-none overflow-hidden overscroll-none">
      <motion.div
        className="absolute inset-0 flex flex-col"
        style={{ scale: homeScale, opacity: homeOpacity, pointerEvents: open ? "none" : "auto" }}
      >
        <div className="shrink-0" style={{ height: STATUS_H }} />
        <HomeGrid onOpen={openApp} hiddenIcon={hiddenIcon} />
        <PhoneDock onOpen={openApp} hiddenIcon={hiddenIcon} />
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
        >
          {renderPhoneView(open.id)}
        </AppLayer>
      )}

      <StatusBar inApp={!!open && !open.closing} />
    </div>
  );
}
