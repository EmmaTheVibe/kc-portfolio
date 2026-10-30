"use client";

import { useId, type ReactNode } from "react";
import type { IconId } from "@/lib/apps";
import { AppIcon } from "./AppIcons";

/**
 * Windows 11-style app icons. Unlike iOS there's no shared tile: each one is a free-standing
 * Fluent shape on a transparent background, drawn on a 256 grid.
 */
const glyphs: Record<Exclude<IconId, "assistant">, (id: string) => ReactNode> = {
  // Sticky Notes
  notes: (id) => (
    <>
      <defs>
        <linearGradient id={`${id}-note`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe774" />
          <stop offset="1" stopColor="#fcc22e" />
        </linearGradient>
      </defs>
      <path d="M58 28h140a30 30 0 0 1 30 30v104l-66 66H58a30 30 0 0 1-30-30V58a30 30 0 0 1 30-30Z" fill={`url(#${id}-note)`} />
      <path d="M28 76V58a30 30 0 0 1 30-30h140a30 30 0 0 1 30 30v18Z" fill="#f2ad0c" />
      <path d="M228 162h-42a24 24 0 0 0-24 24v42Z" fill="#fff1b8" />
      <path d="M68 120h118M68 152h84" stroke="#d99a09" strokeOpacity=".55" strokeWidth="12" strokeLinecap="round" />
    </>
  ),
  // Teams-style chat
  messages: (id) => (
    <>
      <defs>
        <linearGradient id={`${id}-tile`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5a62c3" />
          <stop offset="1" stopColor="#3940ab" />
        </linearGradient>
      </defs>
      <circle cx="214" cy="78" r="24" fill="#5059c9" />
      <path d="M186 116h52a12 12 0 0 1 12 12v52a36 36 0 0 1-36 36h-4a36 36 0 0 1-36-36v-52a12 12 0 0 1 12-12Z" fill="#5059c9" />
      <circle cx="146" cy="64" r="34" fill="#7b83eb" />
      <path d="M96 110h102a12 12 0 0 1 12 12v66a60 60 0 0 1-60 60h-6a60 60 0 0 1-60-60v-66a12 12 0 0 1 12-12Z" fill="#7b83eb" />
      <rect x="10" y="78" width="144" height="144" rx="16" fill={`url(#${id}-tile)`} />
      <path d="M46 112h72v22H93v66H71v-66H46Z" fill="#fff" />
    </>
  ),
  // Edge
  browser: (id) => (
    <>
      <defs>
        <linearGradient id={`${id}-wave`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#2fb4f0" />
          <stop offset=".55" stopColor="#2bc3d2" />
          <stop offset="1" stopColor="#5ee36a" />
        </linearGradient>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1b9de2" />
          <stop offset=".6" stopColor="#0c6cc8" />
          <stop offset="1" stopColor="#114a8b" />
        </linearGradient>
      </defs>
      <path
        d="M20 130C20 196 74 240 138 240c38 0 72-16 94-44-14 6-30 10-48 10-56 0-96-34-96-74 0-22 10-40 28-50-8-2-18-4-28-4-40 0-68 30-68 72Z"
        fill={`url(#${id}-body)`}
      />
      <path
        d="M20 130C22 66 72 18 136 18c66 0 104 46 104 94 0 36-24 60-58 60-26 0-40-10-40-22 0-6 8-12 8-28 0-28-26-58-70-58-32 0-58 22-60 66Z"
        fill={`url(#${id}-wave)`}
      />
    </>
  ),
  // Microsoft Store
  store: (id) => (
    <>
      <defs>
        <linearGradient id={`${id}-bag`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fdfdfd" />
          <stop offset="1" stopColor="#d4d6da" />
        </linearGradient>
      </defs>
      <path d="M92 82V68a36 36 0 0 1 72 0v14" fill="none" stroke="#6b6f76" strokeWidth="14" strokeLinecap="round" />
      <path
        d="M46 74h164a14 14 0 0 1 14 15l-9 125a22 22 0 0 1-22 20H63a22 22 0 0 1-22-20L32 89a14 14 0 0 1 14-15Z"
        fill={`url(#${id}-bag)`}
        stroke="#b4b8be"
        strokeWidth="3"
      />
      <rect x="94" y="114" width="32" height="32" fill="#f25022" />
      <rect x="130" y="114" width="32" height="32" fill="#7fba00" />
      <rect x="94" y="150" width="32" height="32" fill="#00a4ef" />
      <rect x="130" y="150" width="32" height="32" fill="#ffb900" />
    </>
  ),
  // Photos
  photos: (id) => (
    <>
      <defs>
        <radialGradient id={`${id}-sky`} cx="0.2" cy="0" r="1.2">
          <stop offset=".3" stopColor="#0fafff" />
          <stop offset=".75" stopColor="#367af2" />
        </radialGradient>
        <linearGradient id={`${id}-hill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c4e7ff" />
          <stop offset="1" stopColor="#8cd0ff" />
        </linearGradient>
      </defs>
      <rect x="24" y="36" width="208" height="184" rx="30" fill={`url(#${id}-sky)`} />
      <path d="M24 196l76-70a18 18 0 0 1 24 0l50 46 14-12a18 18 0 0 1 24 0l20 18v12a30 30 0 0 1-30 30H54a30 30 0 0 1-30-24Z" fill={`url(#${id}-hill)`} />
      <circle cx="178" cy="88" r="22" fill="#eef8ff" />
    </>
  ),
  // PDF document
  resume: () => (
    <>
      <path d="M62 20h94l60 60v138a20 20 0 0 1-20 20H62a20 20 0 0 1-20-20V40a20 20 0 0 1 20-20Z" fill="#fff" stroke="#c4c4c4" strokeWidth="4" />
      <path d="M156 20v42a18 18 0 0 0 18 18h42Z" fill="#e3e3e3" />
      <path d="M78 104h100M78 222h100" stroke="#d6d6d6" strokeWidth="10" strokeLinecap="round" />
      <rect x="22" y="128" width="148" height="70" rx="12" fill="#d7322b" />
      <text x="96" y="177" textAnchor="middle" fontFamily="Segoe UI, Arial, sans-serif" fontWeight="700" fontSize="44" fill="#fff">
        PDF
      </text>
    </>
  ),
  // File Explorer
  files: (id) => (
    <>
      <defs>
        <linearGradient id={`${id}-front`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd96e" />
          <stop offset="1" stopColor="#f5b52a" />
        </linearGradient>
      </defs>
      <path d="M24 66a20 20 0 0 1 20-20h52c8 0 14 3 19 8l14 14h83a20 20 0 0 1 20 20v14H24Z" fill="#e09d17" />
      <rect x="24" y="84" width="208" height="140" rx="18" fill={`url(#${id}-front)`} />
      <rect x="48" y="186" width="68" height="16" rx="8" fill="#1e74d8" />
    </>
  ),
  // Mail
  mail: (id) => (
    <>
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2f8af5" />
          <stop offset="1" stopColor="#1a5fd6" />
        </linearGradient>
        <linearGradient id={`${id}-flap`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6ce0ff" />
          <stop offset=".5" stopColor="#29c3ff" />
          <stop offset="1" stopColor="#4894fe" />
        </linearGradient>
      </defs>
      <rect x="20" y="52" width="216" height="160" rx="26" fill={`url(#${id}-body)`} />
      <path d="M20 86v-8a26 26 0 0 1 26-26h164a26 26 0 0 1 26 26v8l-100 54a16 16 0 0 1-16 0Z" fill={`url(#${id}-flap)`} />
    </>
  ),
  // Settings
  settings: (id) => (
    <>
      <defs>
        <linearGradient id={`${id}-gear`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c3c9cf" />
          <stop offset="1" stopColor="#6c737a" />
        </linearGradient>
        <mask id={`${id}-hole`}>
          <rect width="256" height="256" fill="#fff" />
          <circle cx="128" cy="128" r="34" fill="#000" />
        </mask>
      </defs>
      <g fill={`url(#${id}-gear)`} mask={`url(#${id}-hole)`}>
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x="106" y="18" width="44" height="60" rx="12" transform={`rotate(${i * 45} 128 128)`} />
        ))}
        <circle cx="128" cy="128" r="86" />
      </g>
    </>
  ),
};

export function WinIcon({ icon, className }: { icon: IconId; className?: string }) {
  const id = `wi${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg viewBox="0 0 256 256" className={className} aria-hidden>
      {icon === "assistant" ? (
        // The assistant keeps its own tile on every platform, inset to match the other icons' margins.
        <g transform="translate(26 26) scale(.797)">
          <AppIcon icon="assistant" />
        </g>
      ) : (
        glyphs[icon](id)
      )}
    </svg>
  );
}

/** Windows 11 logo: four blue panes. */
export function WindowsLogo({ className }: { className?: string }) {
  const id = `wl${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#30c3f5" />
          <stop offset="1" stopColor="#0a63d6" />
        </linearGradient>
      </defs>
      <path d="M1 1h10.6v10.6H1zM12.4 1H23v10.6H12.4zM1 12.4h10.6V23H1zM12.4 12.4H23V23H12.4z" fill={`url(#${id})`} />
    </svg>
  );
}
