"use client";

import { FileText, Mail, ShieldCheck, type LucideIcon } from "lucide-react";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { openExternal, ProjectIcon } from "../shared";

export type Favourite = { label: string; href: string; color: string; letter?: string; icon?: LucideIcon };

export const favourites: Favourite[] = [
  { label: "GitHub", href: profile.github, color: "#24292f", letter: "G" },
  { label: "LinkedIn", href: profile.linkedin, color: "#0a66c2", letter: "in" },
  { label: "Email", href: `mailto:${profile.email}`, color: "#007aff", icon: Mail },
  { label: "Résumé", href: profile.resumePdf, color: "#5e5ce6", icon: FileText },
];

export const host = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

/** Start-page content shared by the desktop and phone browsers. Links open in a real tab. */
export function StartPage({ size }: { size: "desktop" | "phone" }) {
  const phone = size === "phone";
  const h2 = phone ? "mb-3 text-[22px] font-bold" : "mb-3 text-[17px] font-bold";

  return (
    <div className={`mx-auto w-full ${phone ? "px-4" : "max-w-[720px] px-8 py-8"}`}>
      <h2 className={h2}>Favourites</h2>
      <div className={`grid gap-4 ${phone ? "grid-cols-4" : "grid-cols-[repeat(auto-fill,minmax(76px,1fr))]"}`}>
        {favourites.map((f) => {
          const Icon = f.icon;
          return (
            <button key={f.label} type="button" onClick={() => openExternal(f.href)} className="flex flex-col items-center gap-1.5">
              <span
                className="grid size-16 place-items-center rounded-2xl text-[22px] font-bold text-white shadow-sm"
                style={{ background: f.color }}
              >
                {Icon ? <Icon className="size-7" /> : f.letter}
              </span>
              <span className={`${phone ? "text-[12px]" : "text-[11px]"} truncate text-black/70 dark:text-white/70`}>{f.label}</span>
            </button>
          );
        })}
        {projects.map((p) => (
          <button key={p.id} type="button" onClick={() => openExternal(p.url)} className="flex flex-col items-center gap-1.5">
            <ProjectIcon project={p} size={64} />
            <span className={`${phone ? "text-[12px]" : "text-[11px]"} w-full truncate text-center text-black/70 dark:text-white/70`}>
              {p.name}
            </span>
          </button>
        ))}
      </div>

      <h2 className={`${h2} mt-8`}>Live Demos</h2>
      <div className={`grid gap-3 ${phone ? "grid-cols-1" : "grid-cols-2"}`}>
        {projects.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => openExternal(p.url)}
            className="overflow-hidden rounded-xl bg-black/[.04] text-left transition-colors hover:bg-black/[.07] dark:bg-white/[.06] dark:hover:bg-white/10"
          >
            <span
              className="block aspect-[16/7]"
              style={{ background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]})` }}
            />
            <span className="block px-3 py-2">
              <span className="block truncate text-[13px] font-semibold">{p.name}</span>
              <span className="block truncate text-[11px] text-black/45 dark:text-white/45">{host(p.url)}</span>
            </span>
          </button>
        ))}
      </div>

      <h2 className={`${h2} mt-8`}>Privacy Report</h2>
      <div className="flex items-center gap-3 rounded-xl bg-black/[.04] p-4 dark:bg-white/[.06]">
        <ShieldCheck className="size-8 shrink-0 text-accent" />
        <p className="text-[13px] leading-snug">
          In the last seven days, this site has blocked <span className="font-semibold">0 trackers</span>, mostly because it never
          added any.
        </p>
      </div>
    </div>
  );
}

/** Address-bar submit: opens anything that looks like a URL in a new tab. */
export function openAddress(value: string) {
  const v = value.trim();
  if (!v.includes(".") || v.includes(" ")) return;
  openExternal(/^https?:\/\//.test(v) ? v : `https://${v}`);
}
