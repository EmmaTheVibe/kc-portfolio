"use client";

import { useMemo, useState } from "react";
import { NOTE_GROUPS, notes, plainText, type Note } from "@/content/notes";

export function useNotes() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(notes[0].id);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const match = (n: Note) =>
      !q || n.title.toLowerCase().includes(q) || n.body.some((p) => plainText(p).toLowerCase().includes(q));
    return NOTE_GROUPS.map((name) => ({ name, notes: notes.filter((n) => n.group === name && match(n)) })).filter(
      (g) => g.notes.length > 0,
    );
  }, [query]);

  const selected = notes.find((n) => n.id === selectedId) ?? notes[0];

  return { query, setQuery, groups, selected, select: setSelectedId };
}

export const findNote = (id: string) => notes.find((n) => n.id === id);
