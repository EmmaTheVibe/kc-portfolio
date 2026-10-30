"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { THEME_KEY } from "./themeScript";

export type Theme = "light" | "dark";

const DARK_QUERY = "(prefers-color-scheme: dark)";
const listeners = new Set<() => void>();

function readSaved(): Theme | null {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === "dark" || t === "light" ? t : null;
  } catch {
    return null;
  }
}

function resolve(): Theme {
  return readSaved() ?? (matchMedia(DARK_QUERY).matches ? "dark" : "light");
}

function apply(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const mq = matchMedia(DARK_QUERY);
  const onChange = () => {
    if (readSaved()) return;
    apply(resolve());
    emit();
  };
  mq.addEventListener("change", onChange);
  return () => {
    listeners.delete(cb);
    mq.removeEventListener("change", onChange);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

export function setTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}
  apply(theme);
  emit();
}

export function useTheme() {
  // The inline script in <head> sets the class before paint. In development,
  // Strict Mode's remount resets <html> attributes, so re-apply it here.
  useLayoutEffect(() => {
    const t = resolve();
    if (getSnapshot() !== t) {
      apply(t);
      emit();
    }
  }, []);

  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    theme,
    toggle: () => setTheme(theme === "dark" ? "light" : "dark"),
  };
}
