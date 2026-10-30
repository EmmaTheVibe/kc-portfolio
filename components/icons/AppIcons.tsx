"use client";

import { useId, type ReactNode } from "react";
import type { IconId } from "@/lib/apps";

const SQUIRCLE = <rect width="512" height="512" rx="115" />;

type Spec = {
  from: string;
  to: string;
  glyph: (id: string) => ReactNode;
};

const PETALS = ["#f99a1c", "#fcd30f", "#a6cc3a", "#4cb847", "#39a9d4", "#5266b0", "#9c5ba8", "#e9465c"];
const RAYS = [150, 122, 158, 116, 146, 130, 160, 120, 142, 152, 114, 138];

const specs: Record<IconId, Spec> = {
  notes: {
    from: "#ffffff",
    to: "#f2f2f2",
    glyph: (id) => (
      <>
        <defs>
          <linearGradient id={`${id}-band`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe36e" />
            <stop offset="1" stopColor="#fcc419" />
          </linearGradient>
        </defs>
        <rect width="512" height="146" fill={`url(#${id}-band)`} />
        <g fill="#c8c8c8">
          {Array.from({ length: 18 }, (_, i) => (
            <circle key={i} cx={18 + i * 28.5} cy="170" r="6" />
          ))}
        </g>
        <path d="M0 240H512M0 306H512M0 372H512M0 438H512" stroke="#d6d6d6" strokeWidth="6" />
      </>
    ),
  },
  messages: {
    from: "#5df777",
    to: "#0abd2c",
    glyph: () => (
      <g fill="#fff">
        <ellipse cx="256" cy="240" rx="170" ry="142" />
        <path d="M148 330c2 38-16 66-46 84 52 4 94-12 124-40Z" />
      </g>
    ),
  },
  browser: {
    from: "#ffffff",
    to: "#e6e6ea",
    glyph: (id) => (
      <>
        <defs>
          <linearGradient id={`${id}-dial`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1bd2ff" />
            <stop offset="1" stopColor="#1a5ef0" />
          </linearGradient>
        </defs>
        <circle cx="256" cy="256" r="200" fill={`url(#${id}-dial)`} />
        <g stroke="#fff" strokeLinecap="round">
          {Array.from({ length: 72 }, (_, i) => (
            <path
              key={i}
              d={i % 6 === 0 ? "M256 70V96" : "M256 72V88"}
              strokeWidth={i % 6 === 0 ? 6 : 3.5}
              strokeOpacity={i % 6 === 0 ? 1 : 0.8}
              transform={`rotate(${i * 5} 256 256)`}
            />
          ))}
        </g>
        <g transform="rotate(45 256 256)">
          <path d="M256 110L282 256H230Z" fill="#ff3b30" />
          <path d="M256 402L282 256H230Z" fill="#fff" />
        </g>
      </>
    ),
  },
  store: {
    from: "#1acbfd",
    to: "#1a6cf4",
    glyph: () => (
      <path
        d="M256 136L154 312M136 344L118 376M256 136L394 376M124 312H388"
        fill="none"
        stroke="#fff"
        strokeWidth="34"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    ),
  },
  photos: {
    from: "#ffffff",
    to: "#f4f4f4",
    glyph: () => (
      <g>
        {PETALS.map((c, i) => (
          <rect
            key={c}
            x="196"
            y="88"
            width="104"
            height="168"
            rx="52"
            fill={c}
            opacity=".88"
            style={{ mixBlendMode: "multiply" }}
            transform={`rotate(${i * 45} 256 256)`}
          />
        ))}
      </g>
    ),
  },
  resume: {
    from: "#7fb2ff",
    to: "#2f66e0",
    glyph: () => (
      <>
        <path d="M150 92h150l68 68v240a28 28 0 0 1-28 28H150a28 28 0 0 1-28-28V120a28 28 0 0 1 28-28Z" fill="#fff" />
        <path d="M300 92v52a16 16 0 0 0 16 16h52" fill="#d6e4ff" />
        <circle cx="196" cy="190" r="28" fill="#2f66e0" />
        <g stroke="#b8c8e8" strokeWidth="14" strokeLinecap="round">
          <path d="M240 178h56M240 206h36M166 262h168M166 300h168M166 338h120" />
        </g>
      </>
    ),
  },
  assistant: {
    from: "#df8263",
    to: "#c9643f",
    glyph: () => (
      <g fill="#fdf6ee" stroke="#fdf6ee" strokeWidth="18" strokeLinejoin="round">
        {RAYS.map((len, i) => (
          <path
            key={i}
            d={`M238 256L256 ${256 - len + 10}L274 256Z`}
            transform={`rotate(${i * 30 + (i % 3) * 6} 256 256)`}
          />
        ))}
        <circle cx="256" cy="256" r="26" stroke="none" />
      </g>
    ),
  },
  files: {
    from: "#ffffff",
    to: "#eef1f6",
    glyph: (id) => (
      <>
        <defs>
          <linearGradient id={`${id}-folder`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5fbdff" />
            <stop offset="1" stopColor="#1f86f6" />
          </linearGradient>
        </defs>
        <path d="M100 164a24 24 0 0 1 24-24h82c10 0 18 4 26 12l18 18h138a24 24 0 0 1 24 24v30H100Z" fill="#1678e8" />
        <rect x="100" y="198" width="312" height="190" rx="24" fill={`url(#${id}-folder)`} />
        <path d="M124 198H388" stroke="#fff" strokeOpacity=".35" strokeWidth="4" />
      </>
    ),
  },
  mail: {
    from: "#22a4ff",
    to: "#1263ef",
    glyph: () => (
      <>
        <rect x="92" y="150" width="328" height="212" rx="26" fill="#fff" />
        <g fill="none" stroke="#c6d3e4" strokeLinejoin="round" strokeLinecap="round">
          <path d="M102 164L256 282L410 164" strokeWidth="10" />
          <path d="M104 350L214 250M408 350L298 250" strokeWidth="7" />
        </g>
      </>
    ),
  },
  settings: {
    from: "#d1d1d6",
    to: "#8e8e93",
    glyph: () => (
      <>
        <g fill="#3a3a3e">
          {Array.from({ length: 40 }, (_, i) => (
            <rect key={i} x="247" y="58" width="18" height="34" rx="4" transform={`rotate(${i * 9} 256 256)`} />
          ))}
          <circle cx="256" cy="256" r="178" />
        </g>
        <circle cx="256" cy="256" r="152" fill="#cfcfd4" />
        <circle cx="256" cy="256" r="138" fill="#4a4a4f" />
        <circle cx="256" cy="256" r="116" fill="#c2c2c7" />
        <g fill="#4a4a4f">
          {Array.from({ length: 6 }, (_, i) => (
            <rect key={i} x="245" y="142" width="22" height="114" rx="6" transform={`rotate(${i * 60 + 30} 256 256)`} />
          ))}
          <circle cx="256" cy="256" r="48" />
        </g>
        <circle cx="256" cy="256" r="20" fill="#c2c2c7" />
      </>
    ),
  },
};

/**
 * `cover` fills a non-square box (cropping like object-fit: cover) and drops the rounded
 * corners, leaving the shape to the container. The phone's app-zoom copy uses it.
 */
export function AppIcon({ icon, className, cover }: { icon: IconId; className?: string; cover?: boolean }) {
  const id = `ic${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const spec = specs[icon];
  return (
    <svg viewBox="0 0 512 512" preserveAspectRatio={cover ? "xMidYMid slice" : undefined} className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={spec.from} />
          <stop offset="1" stopColor={spec.to} />
        </linearGradient>
        <clipPath id={`${id}-clip`}>{SQUIRCLE}</clipPath>
      </defs>
      <g clipPath={cover ? undefined : `url(#${id}-clip)`}>
        <rect width="512" height="512" fill={`url(#${id}-bg)`} />
        {spec.glyph(id)}
      </g>
    </svg>
  );
}

/** Apple logo for the menu bar, as an SVG so it renders on every OS (the  glyph only exists on Apple devices). */
export function SystemMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
      />
    </svg>
  );
}
