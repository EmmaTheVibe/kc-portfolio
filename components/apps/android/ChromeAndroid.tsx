"use client";

import { EllipsisVertical, Home, Mic, Search } from "lucide-react";
import type { FormEvent } from "react";
import { projects } from "@/content/projects";
import { AScreen } from "../../android/Material";
import { LensMark } from "../../icons/AndroidIcons";
import { favourites, host } from "../browser/StartPage";
import { openExternal, ProjectIcon } from "../shared";

const GOOGLE = [
  ["G", "#4285f4"],
  ["o", "#ea4335"],
  ["o", "#fbbc04"],
  ["g", "#4285f4"],
  ["l", "#34a853"],
  ["e", "#ea4335"],
] as const;

/** Opens anything that looks like an address; searches Google for everything else. Both in a real tab. */
function go(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const v = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value.trim();
  if (!v) return;
  const isUrl = v.includes(".") && !v.includes(" ");
  openExternal(isUrl ? (/^https?:\/\//.test(v) ? v : `https://${v}`) : `https://www.google.com/search?q=${encodeURIComponent(v)}`);
}

/** Chrome's toolbar: home, the omnibox, the tab switcher and the menu. */
function Toolbar() {
  return (
    <div className="flex h-16 items-center gap-1 px-1">
      <span aria-hidden className="grid size-12 shrink-0 place-items-center">
        <Home className="size-6" />
      </span>
      <form onSubmit={go} className="min-w-0 flex-1">
        <input
          name="q"
          aria-label="Search or type web address"
          enterKeyHint="go"
          autoComplete="off"
          placeholder="Search or type web address"
          className="h-12 w-full rounded-full bg-(--md-surface-container-high) px-4 text-[16px] outline-none placeholder:text-(--md-on-surface-variant)"
        />
      </form>
      <span aria-hidden className="grid size-12 shrink-0 place-items-center">
        <span className="grid size-5.5 place-items-center rounded-[5px] border-2 border-current text-[11px] font-bold">1</span>
      </span>
      <span aria-hidden className="grid size-12 shrink-0 place-items-center">
        <EllipsisVertical className="size-6" />
      </span>
    </div>
  );
}

function Tile({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="flex min-w-0 flex-col items-center gap-2">
      <span className="grid size-14 place-items-center rounded-2xl bg-(--md-surface-container-high)">{children}</span>
      <span className="w-full truncate text-center text-[12px]">{label}</span>
    </button>
  );
}

/** Chrome's New Tab page: Google, a search box, shortcuts and a Discover-style feed of live demos. */
export function ChromeAndroid() {
  return (
    <AScreen header={<Toolbar />}>
      <div className="flex flex-col items-center px-4 pt-10">
        <p aria-label="Google" className="text-[56px] leading-none font-medium tracking-[-0.03em]">
          {GOOGLE.map(([ch, color], i) => (
            <span key={i} style={{ color }}>
              {ch}
            </span>
          ))}
        </p>
        <form onSubmit={go} className="mt-8 flex h-13 w-full items-center gap-3 rounded-full bg-(--md-surface-container-high) pr-3 pl-4">
          <Search className="size-5 shrink-0 text-(--md-on-surface-variant)" />
          <input
            name="q"
            aria-label="Search Google or type URL"
            enterKeyHint="search"
            autoComplete="off"
            placeholder="Search Google or type URL"
            className="min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-(--md-on-surface-variant)"
          />
          <Mic aria-hidden className="size-5.5 shrink-0" />
          <LensMark className="size-5.5 shrink-0" />
        </form>

        <div className="mt-8 grid w-full grid-cols-4 gap-x-3 gap-y-5">
          {favourites.map((f) => {
            const Icon = f.icon;
            return (
              <Tile key={f.label} label={f.label} onClick={() => openExternal(f.href)}>
                <span className="grid size-8 place-items-center rounded-full text-[13px] font-bold text-white" style={{ background: f.color }}>
                  {Icon ? <Icon className="size-4.5" /> : f.letter}
                </span>
              </Tile>
            );
          })}
          {projects.map((p) => (
            <Tile key={p.id} label={p.name} onClick={() => openExternal(p.url)}>
              <ProjectIcon project={p} size={32} />
            </Tile>
          ))}
        </div>
      </div>

      <h2 className="mt-10 px-4 pb-3 text-[16px] font-medium">Discover</h2>
      <div className="space-y-3 px-4">
        {projects.map((p) => (
          <button key={p.id} type="button" onClick={() => openExternal(p.url)} className="block w-full overflow-hidden rounded-3xl bg-(--md-surface-container-low) text-left">
            <span className="block aspect-[16/8]" style={{ background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]})` }} />
            <span className="block px-4 pt-3 pb-4">
              <span className="block text-[16px] leading-6 font-medium">
                {p.name}: {p.tagline}
              </span>
              <span className="mt-1 block text-[12px] text-(--md-on-surface-variant)">{host(p.url)} • Live demo</span>
            </span>
          </button>
        ))}
      </div>
    </AScreen>
  );
}
