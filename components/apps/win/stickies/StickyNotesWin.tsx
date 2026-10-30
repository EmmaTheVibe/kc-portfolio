"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { plainText } from "@/content/notes";
import { stickies } from "@/content/stickies";
import { STICKY_COLORS } from "./StickyBoard";
import { stickyActions, usePlacedStickies } from "./store";

/** The Sticky Notes list window. Clicking a note sticks it to the desktop. */
export function StickyNotesWin() {
  const [query, setQuery] = useState("");
  const placed = usePlacedStickies();
  const q = query.trim().toLowerCase();
  const list = stickies.filter(
    (s) => !q || s.title.toLowerCase().includes(q) || s.body.some((p) => plainText(p).toLowerCase().includes(q)),
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f9f9f9] dark:bg-[#202020]">
      <h1 className="px-4 pt-1 pb-3 text-[20px] font-semibold">Sticky Notes</h1>
      <div className="px-4 pb-3">
        <label className="flex h-8 items-center gap-2 rounded-md border border-black/8 border-b-black/30 bg-white px-2.5 text-[13px] focus-within:border-b-2 focus-within:border-b-[#005fb8] dark:border-white/8 dark:border-b-white/40 dark:bg-white/5 dark:focus-within:border-b-[#60cdff]">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            aria-label="Search notes"
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-black/50 dark:placeholder:text-white/50"
          />
          <Search className="size-3.5 shrink-0 opacity-60" />
        </label>
      </div>

      <div className="os-scroll min-h-0 flex-1 space-y-2 overflow-y-auto px-4 pb-4">
        {list.length === 0 && <p className="pt-2 text-[13px] text-black/55 dark:text-white/55">No notes match “{query.trim()}”</p>}
        {list.map((s) => {
          const onDesktop = placed.some((p) => p.id === s.id);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => stickyActions.open(s.id)}
              className="block w-full overflow-hidden rounded-md border border-black/8 bg-white text-left shadow-sm transition-colors hover:bg-black/2 dark:border-white/8 dark:bg-[#2b2b2b] dark:hover:bg-[#323232]"
            >
              <span className="block h-1" style={{ background: STICKY_COLORS[s.color].bar }} />
              <span className="block px-3 pt-2 pb-2.5">
                <span className="flex items-baseline gap-2">
                  <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">{s.title}</span>
                  <span className="shrink-0 text-[11px] text-black/50 dark:text-white/50">{onDesktop ? "On desktop" : s.date}</span>
                </span>
                <span className="mt-0.5 line-clamp-2 text-[12px] leading-4 text-black/60 dark:text-white/60">
                  {s.body.map(plainText).join(" ")}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
