"use client";

import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { SearchField } from "../shared";
import { NoteContent } from "./NoteContent";
import { useNotes } from "./useNotes";

export function NotesDesktop() {
  const { query, setQuery, groups, selected, select } = useNotes();
  // Only matters in narrow windows, where the list and the note take turns.
  const [showNote, setShowNote] = useState(true);

  return (
    <div className="flex min-h-0 flex-1">
      <aside
        className={`flex w-[220px] shrink-0 flex-col border-r border-black/10 dark:border-white/10 @max-md:w-full @max-md:border-r-0 ${
          showNote ? "@max-md:hidden" : ""
        }`}
      >
        <div className="p-2">
          <SearchField value={query} onChange={setQuery} />
        </div>
        <div className="os-scroll min-h-0 flex-1 overflow-y-auto px-2 pb-2">
          {groups.length === 0 && <p className="px-2 pt-3 text-[12px] text-black/40 dark:text-white/40">No results</p>}
          {groups.map((g) => (
            <section key={g.name}>
              <h3 className="px-2 pt-3 pb-1 text-[11px] font-semibold text-black/40 dark:text-white/40">{g.name}</h3>
              {g.notes.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => {
                    select(n.id);
                    setShowNote(true);
                  }}
                  className={`block w-full rounded-lg px-3 py-2 text-left ${
                    n.id === selected.id ? "bg-note-selected/25" : "hover:bg-black/5 dark:hover:bg-white/10"
                  }`}
                >
                  <div className="truncate text-[13px] leading-[19.5px] font-semibold">{n.title}</div>
                  <div className="truncate text-[11px]">
                    <span className="text-black/50 dark:text-white/50">{n.date}</span>
                    <span className="ml-1.5 text-black/40 dark:text-white/40">{n.preview}</span>
                  </div>
                </button>
              ))}
            </section>
          ))}
        </div>
      </aside>

      <article
        className={`flex min-w-0 flex-1 flex-col bg-white dark:bg-[#1e1e1e] ${showNote ? "" : "@max-md:hidden"}`}
      >
        <div className="relative pt-3 text-center text-[11px] text-black/40 dark:text-white/40">
          <button
            type="button"
            onClick={() => setShowNote(false)}
            aria-label="Back to notes"
            className="absolute left-2 top-1.5 rounded p-0.5 text-black/60 hover:bg-black/5 @md:hidden dark:text-white/60 dark:hover:bg-white/10"
          >
            <ChevronLeft className="size-4" />
          </button>
          {selected.date}
        </div>
        <div className="os-scroll min-h-0 flex-1 overflow-y-auto px-6 pt-2 pb-4">
          <NoteContent note={selected} size="desktop" />
        </div>
      </article>
    </div>
  );
}
