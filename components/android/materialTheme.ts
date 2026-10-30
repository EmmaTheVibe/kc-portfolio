import type { CSSProperties } from "react";
import type { Theme } from "@/lib/useTheme";

/**
 * Material You colour roles from a blue seed, for both themes. The Android skin sets them inline on
 * its root, and components read them as Tailwind arbitrary values: bg-(--md-surface) and so on.
 */
const roles: Record<Theme, Record<string, string>> = {
  light: {
    primary: "#415f91",
    "on-primary": "#ffffff",
    "primary-container": "#d6e3ff",
    "on-primary-container": "#001b3e",
    "secondary-container": "#dae2f9",
    "on-secondary-container": "#131c2b",
    "tertiary-container": "#fbd7fc",
    "on-tertiary-container": "#29132d",
    surface: "#f9f9ff",
    "surface-container-low": "#f3f3fa",
    "surface-container": "#ededf4",
    "surface-container-high": "#e7e8ee",
    "surface-container-highest": "#e2e2e9",
    "on-surface": "#191c20",
    "on-surface-variant": "#44474e",
    outline: "#74777f",
    "outline-variant": "#c4c6d0",
  },
  dark: {
    primary: "#aac7ff",
    "on-primary": "#0a305f",
    "primary-container": "#284777",
    "on-primary-container": "#d6e3ff",
    "secondary-container": "#3e4759",
    "on-secondary-container": "#dae2f9",
    "tertiary-container": "#573e5c",
    "on-tertiary-container": "#fbd7fc",
    surface: "#111318",
    "surface-container-low": "#191c20",
    "surface-container": "#1d2024",
    "surface-container-high": "#282a2f",
    "surface-container-highest": "#33353a",
    "on-surface": "#e2e2e9",
    "on-surface-variant": "#c4c6d0",
    outline: "#8e9099",
    "outline-variant": "#44474e",
  },
};

const styles = Object.fromEntries(
  (Object.keys(roles) as Theme[]).map((t) => [
    t,
    {
      fontFamily: 'Roboto, "Google Sans", system-ui, sans-serif',
      ...Object.fromEntries(Object.entries(roles[t]).map(([k, v]) => [`--md-${k}`, v])),
    } as CSSProperties,
  ]),
) as Record<Theme, CSSProperties>;

export const materialTheme = (theme: Theme) => styles[theme];
