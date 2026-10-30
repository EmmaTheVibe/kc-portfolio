"use client";

import { ChevronRight, Lock, Moon, Power, RotateCw, Search } from "lucide-react";
import { useState, type ReactNode } from "react";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { winLabels, type AppId, type IconId } from "@/lib/apps";
import { WinIcon } from "../icons/WinIcons";
import { Avatar, ProjectIcon } from "../apps/shared";
import { Flyout, acrylic } from "./Flyout";

const PINNED: Exclude<IconId, "files" | "mail">[] = [
  "notes",
  "browser",
  "messages",
  "photos",
  "store",
  "resume",
  "assistant",
  "settings",
];

type Recommended = { key: string; icon: ReactNode; title: string; detail: string; app: AppId };

const recommended: Recommended[] = [
  { key: "resume", icon: <WinIcon icon="resume" className="size-8" />, title: "Résumé.pdf", detail: "Recently opened", app: "resume" },
  ...projects.slice(0, 3).map((p) => ({
    key: p.id,
    icon: <ProjectIcon project={p} size={32} />,
    title: p.name,
    detail: `${p.category} · ${p.year}`,
    app: "store" as const,
  })),
];

const tile = "rounded-md transition-colors duration-100 hover:bg-white/70 dark:hover:bg-white/6";

export function StartMenu({ onLaunch, onLock }: { onLaunch: (id: AppId) => void; onLock: () => void }) {
  const [query, setQuery] = useState("");
  const [power, setPower] = useState(false);
  const q = query.trim().toLowerCase();
  const pinned = PINNED.filter((id) => winLabels[id].toLowerCase().includes(q));

  const powerItems: { label: string; icon: ReactNode; onClick?: () => void }[] = [
    { label: "Lock", icon: <Lock className="size-4" />, onClick: onLock },
    { label: "Sleep", icon: <Moon className="size-4" />, onClick: onLock },
    { label: "Shut down", icon: <Power className="size-4" /> },
    { label: "Restart", icon: <RotateCw className="size-4" /> },
  ];

  return (
    <Flyout label="Start" className="left-1/2 w-160 max-w-[calc(100vw-16px)] -translate-x-1/2">
      <div className={`flex max-h-[calc(100vh-72px)] flex-col overflow-hidden ${acrylic}`}>
        <div className="px-8 pt-6">
          <label className="flex h-9 items-center gap-2.5 rounded-full border border-black/8 border-b-2 border-b-[#005fb8] bg-white/80 px-4 text-[13px] dark:border-white/8 dark:border-b-[#60cdff] dark:bg-black/25">
            <Search className="size-4 shrink-0 opacity-60" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && pinned[0]) onLaunch(pinned[0]);
              }}
              placeholder="Search for apps, settings, and documents"
              aria-label="Search"
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-black/50 dark:placeholder:text-white/50"
            />
          </label>
        </div>

        <div className="os-scroll min-h-0 flex-1 overflow-y-auto px-8 pt-5 pb-4">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-[14px] font-semibold">{q ? "Best match" : "Pinned"}</h2>
            {!q && (
              <span className="flex items-center gap-1 rounded border border-black/8 bg-white/70 px-2 py-0.5 text-[12px] dark:border-white/8 dark:bg-white/6">
                All apps <ChevronRight className="size-3" />
              </span>
            )}
          </div>
          <div className="mt-3 grid grid-cols-4 min-[560px]:grid-cols-6">
            {pinned.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => onLaunch(id)}
                className={`flex flex-col items-center gap-1.5 px-1 py-3 ${tile}`}
              >
                <WinIcon icon={id} className="size-8" />
                <span className="w-full truncate text-center text-[12px]">{winLabels[id]}</span>
              </button>
            ))}
          </div>
          {pinned.length === 0 && (
            <p className="px-4 py-6 text-[13px] text-black/55 dark:text-white/55">No results for “{query.trim()}”</p>
          )}

          {!q && (
            <>
              <h2 className="mt-5 px-4 text-[14px] font-semibold">Recommended</h2>
              <div className="mt-2 grid grid-cols-1 gap-1 min-[560px]:grid-cols-2">
                {recommended.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => onLaunch(r.app)}
                    className={`flex items-center gap-3 px-4 py-2.5 text-left ${tile}`}
                  >
                    {r.icon}
                    <span className="min-w-0">
                      <span className="block truncate text-[12px] font-semibold">{r.title}</span>
                      <span className="block truncate text-[12px] text-black/55 dark:text-white/55">{r.detail}</span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex h-16 shrink-0 items-center justify-between border-t border-black/8 bg-black/3 px-12 dark:border-white/8 dark:bg-black/20">
          <span className="flex items-center gap-3 text-[12px]">
            <Avatar initials={profile.initials} colors={["#a78bfa", "#6d28d9"]} size={32} />
            {profile.fullName}
          </span>
          <div className="relative">
            <button
              type="button"
              aria-label="Power"
              aria-expanded={power}
              onClick={() => setPower(!power)}
              className={`grid size-9 place-items-center ${tile} ${power ? "bg-white/70 dark:bg-white/6" : ""}`}
            >
              <Power className="size-4" />
            </button>
            {power && (
              <div role="menu" className={`absolute right-0 bottom-full mb-2 w-44 p-1 ${acrylic}`}>
                {powerItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    role="menuitem"
                    disabled={!item.onClick}
                    onClick={item.onClick}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-[13px] enabled:hover:bg-black/5 disabled:opacity-40 dark:enabled:hover:bg-white/8"
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Flyout>
  );
}
