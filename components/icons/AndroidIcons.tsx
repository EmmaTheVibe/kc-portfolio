"use client";

import { useId, type ReactNode } from "react";
import type { IconId } from "@/lib/apps";
import { AppIcon } from "./AppIcons";

type Spec = { bg: string; glyph: (id: string) => ReactNode };

/**
 * Pixel-style adaptive icons: Google's marks on a circle, drawn on a 256 grid with the glyph
 * kept inside the middle ~60%, as Android's icon safe zone asks.
 */
const specs: Record<Exclude<IconId, "assistant">, Spec> = {
  // Google Keep
  notes: {
    bg: "#fff",
    glyph: () => (
      <>
        <path d="M88 52h68l32 32v108a12 12 0 0 1-12 12H88a12 12 0 0 1-12-12V64a12 12 0 0 1 12-12Z" fill="#fbbc04" />
        <path d="M156 52v20a12 12 0 0 0 12 12h20Z" fill="#f29900" />
        <circle cx="132" cy="124" r="23" fill="#fff" />
        <rect x="121" y="150" width="22" height="13" rx="3" fill="#fff" />
      </>
    ),
  },
  // Google Messages
  messages: {
    bg: "#fff",
    glyph: (id) => (
      <>
        <defs>
          <linearGradient id={`${id}-msg`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4c8df6" />
            <stop offset="1" stopColor="#0b57d0" />
          </linearGradient>
        </defs>
        <path
          d="M94 62h68a44 44 0 0 1 44 44v24a44 44 0 0 1-44 44h-50l-34 26v-30a44 44 0 0 1-28-40v-24a44 44 0 0 1 44-44Z"
          fill={`url(#${id}-msg)`}
        />
        <path d="M94 106h68M94 134h40" stroke="#fff" strokeWidth="14" strokeLinecap="round" />
      </>
    ),
  },
  // Chrome: three swirled sectors around a blue centre
  browser: {
    bg: "#fff",
    glyph: () => (
      <>
        <g transform="rotate(30 128 128)">
          <path d="M168 128L168 201.9A84 84 0 0 1 44 125.7L108 162.6L128 128Z" fill="#34a853" />
          <path d="M108 162.6L44 125.7A84 84 0 0 1 172 56.4L108 93.4L128 128Z" fill="#ea4335" />
          <path d="M108 93.4L172 56.4A84 84 0 0 1 168 201.9L168 128L128 128Z" fill="#fbbc04" />
        </g>
        <circle cx="128" cy="128" r="40" fill="#fff" />
        <circle cx="128" cy="128" r="31" fill="#1a73e8" />
      </>
    ),
  },
  // Google Play: the four-colour play triangle
  store: {
    bg: "#fff",
    glyph: () => (
      <g strokeLinejoin="round" strokeWidth="10">
        <path d="M80 52L80 204L146 128Z" fill="#2196f3" stroke="#2196f3" />
        <path d="M80 52L146 128L159 102Z" fill="#34a853" stroke="#34a853" />
        <path d="M159 102L200 128L159 154L146 128Z" fill="#fbbc04" stroke="#fbbc04" />
        <path d="M80 204L159 154L146 128Z" fill="#ea4335" stroke="#ea4335" />
      </g>
    ),
  },
  // Google Photos pinwheel
  photos: {
    bg: "#fff",
    glyph: () => (
      <g>
        {["#ea4335", "#4285f4", "#34a853", "#fbbc04"].map((c, i) => (
          <path key={c} d="M128 128V48A40 40 0 0 0 128 128Z" fill={c} transform={`rotate(${i * 90} 128 128)`} />
        ))}
      </g>
    ),
  },
  // A PDF, as Drive shows them
  resume: {
    bg: "#fff",
    glyph: () => (
      <>
        <path d="M86 50h62l38 38v110a10 10 0 0 1-10 10H86a10 10 0 0 1-10-10V60a10 10 0 0 1 10-10Z" fill="#ea4335" />
        <path d="M148 50v28a10 10 0 0 0 10 10h28Z" fill="#f28b82" />
        <rect x="96" y="132" width="66" height="44" rx="6" fill="#fff" />
        <path d="M106 166v-24h8a6 6 0 0 1 0 12h-8M126 142v24h5a12 12 0 0 0 0-24ZM152 166v-24h10M152 154h8" fill="none" stroke="#ea4335" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  // Files by Google
  files: {
    bg: "#fff",
    glyph: () => (
      <>
        <path d="M60 86a14 14 0 0 1 14-14h38l16 16h56a14 14 0 0 1 14 14v8H60Z" fill="#1967d2" />
        <rect x="60" y="100" width="138" height="88" rx="14" fill="#4285f4" />
      </>
    ),
  },
  // Gmail's envelope M
  mail: {
    bg: "#fff",
    glyph: () => (
      <>
        <path d="M54 96a12 12 0 0 1 19-10l15 11v87H64a10 10 0 0 1-10-10Z" fill="#4285f4" />
        <path d="M202 96a12 12 0 0 0-19-10l-15 11v87h24a10 10 0 0 0 10-10Z" fill="#34a853" />
        <path d="M168 97V136l34-25V96a12 12 0 0 0-19-10Z" fill="#fbbc04" />
        <path d="M88 136V97l40 30 40-30v39l-40 30Z" fill="#ea4335" />
        <path d="M54 96v15l34 25V97L73 86a12 12 0 0 0-19 10Z" fill="#c5221f" />
      </>
    ),
  },
  // Settings gear
  settings: {
    bg: "#4a5a7c",
    glyph: (id) => (
      <>
        <defs>
          <mask id={`${id}-hole`}>
            <rect width="256" height="256" fill="#fff" />
            <circle cx="128" cy="128" r="22" fill="#000" />
          </mask>
        </defs>
        <g fill="#fff" mask={`url(#${id}-hole)`}>
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x="113" y="56" width="30" height="40" rx="8" transform={`rotate(${i * 45} 128 128)`} />
          ))}
          <circle cx="128" cy="128" r="56" />
        </g>
      </>
    ),
  },
};

/**
 * `cover` fills a non-square box with the icon's background and drops the circle, leaving the
 * shape to the container (the app-open zoom uses it).
 */
export function AndroidIcon({ icon, className, cover }: { icon: IconId; className?: string; cover?: boolean }) {
  const id = `ai${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  if (icon === "assistant") {
    // The assistant keeps its own artwork on every platform; here it's cropped to the circle.
    return (
      <svg viewBox="0 0 256 256" preserveAspectRatio={cover ? "xMidYMid slice" : undefined} className={className} aria-hidden>
        <defs>
          <clipPath id={`${id}-clip`}>
            <circle cx="128" cy="128" r="128" />
          </clipPath>
        </defs>
        <g clipPath={cover ? undefined : `url(#${id}-clip)`}>
          <AppIcon icon="assistant" cover />
        </g>
      </svg>
    );
  }
  const spec = specs[icon];
  return (
    <svg viewBox="0 0 256 256" preserveAspectRatio={cover ? "xMidYMid slice" : undefined} className={className} aria-hidden>
      {cover ? <rect x="-512" y="-512" width="1280" height="1280" fill={spec.bg} /> : <circle cx="128" cy="128" r="128" fill={spec.bg} />}
      {spec.glyph(id)}
    </svg>
  );
}

/** Google's four-colour G, for the home-screen search bar. */
export function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <g fill="none" strokeWidth="3.4">
        <path d="M19.2 12A7.2 7.2 0 0 1 17.5 16.6" stroke="#4285f4" />
        <path d="M17.5 16.6A7.2 7.2 0 0 1 6.1 16.1" stroke="#34a853" />
        <path d="M6.1 16.1A7.2 7.2 0 0 1 6.1 7.9" stroke="#fbbc04" />
        <path d="M6.1 7.9A7.2 7.2 0 0 1 17.4 7.2" stroke="#ea4335" />
      </g>
      <path d="M12.2 10.3h8.4v3.4h-8.4Z" fill="#4285f4" />
    </svg>
  );
}

/** Google Lens: a rounded viewfinder with a dot, in Google's colours. */
export function LensMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <g fill="none" strokeWidth="2.4" strokeLinecap="round">
        <path d="M4 9V7.5A3.5 3.5 0 0 1 7.5 4H9" stroke="#ea4335" />
        <path d="M15 4h1.5A3.5 3.5 0 0 1 20 7.5V9" stroke="#fbbc04" />
        <path d="M9 20H7.5A3.5 3.5 0 0 1 4 16.5V15" stroke="#4285f4" />
      </g>
      <circle cx="12" cy="12" r="3.4" fill="none" stroke="#4285f4" strokeWidth="2.4" />
      <circle cx="18" cy="18" r="1.8" fill="#34a853" />
    </svg>
  );
}
