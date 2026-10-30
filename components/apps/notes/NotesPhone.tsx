"use client";

import { GroupedRow, GroupedSection } from "../../phone/Grouped";
import { NavScreen, NavStack } from "../../phone/NavStack";
import { SearchField } from "../shared";
import { NoteContent } from "./NoteContent";
import { findNote, useNotes } from "./useNotes";

type Route = { name: "list" } | { name: "note"; id: string };

export function NotesPhone() {
  const { query, setQuery, groups } = useNotes();

  return (
    <NavStack<Route>
      root={{ name: "list" }}
      renderScreen={(route, nav) => {
        const note = route.name === "note" ? findNote(route.id) : undefined;
        if (note) {
          return (
            <NavScreen title={note.title} backLabel="Notes" plain>
              <div className="px-5">
                <p className="mb-3 text-center text-[13px] text-black/40 dark:text-white/40">{note.date}</p>
                <NoteContent note={note} size="phone" />
              </div>
            </NavScreen>
          );
        }
        return (
          <NavScreen title="Notes" largeTitle>
            <div className="px-4 pb-4">
              <SearchField value={query} onChange={setQuery} size="phone" />
            </div>
            {groups.length === 0 && <p className="px-5 text-[15px] text-black/50 dark:text-white/55">No results</p>}
            {groups.map((g) => (
              <GroupedSection key={g.name} title={g.name}>
                {g.notes.map((n) => (
                  <GroupedRow key={n.id} onClick={() => nav.push({ name: "note", id: n.id })}>
                    <div className="truncate text-[17px] leading-[22px] font-semibold">{n.title}</div>
                    <div className="truncate text-[15px] text-black/50 dark:text-white/55">
                      {n.date}
                      <span className="ml-2">{n.preview}</span>
                    </div>
                  </GroupedRow>
                ))}
              </GroupedSection>
            ))}
          </NavScreen>
        );
      }}
    />
  );
}
