"use client";

import { Menu, Pin } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { keepNotes, keepPinned } from "@/content/keep";
import { plainText } from "@/content/notes";
import { profile } from "@/content/profile";
import type { StickyColor, StickyDoc } from "@/content/stickies";
import { AScreen, AStack, SearchBar } from "../../android/Material";
import { Avatar, ExtLink, RichParagraph } from "../shared";

/** Keep's own palette (light, dark): Sand, Mint, Blossom, Dusk, Fog, and the default card. */
const KEEP_COLORS: Record<StickyColor, [string, string] | null> = {
  yellow: ["#fff8b8", "#7c4a03"],
  green: ["#e2f6d3", "#264d3b"],
  pink: ["#f6e2dd", "#6c394f"],
  purple: ["#d3bfdb", "#472e5b"],
  blue: ["#d4e4ed", "#256377"],
  gray: null,
};

/** A note's colour as CSS variables for both themes, plus the classes that use them. Default notes are outlined. */
function noteColor(doc: StickyDoc): { bg: string; border: string; vars?: CSSProperties } {
  const c = KEEP_COLORS[doc.color];
  if (!c) return { bg: "bg-(--md-surface)", border: "border-(--md-outline-variant)" };
  return { bg: "bg-(--keep) dark:bg-(--keep-dark)", border: "border-transparent", vars: { "--keep": c[0], "--keep-dark": c[1] } as CSSProperties };
}

function Card({ doc, onOpen }: { doc: StickyDoc; onOpen: () => void }) {
  const { bg, border, vars } = noteColor(doc);
  return (
    <button type="button" onClick={onOpen} className={`mb-2.5 block w-full break-inside-avoid rounded-xl border px-4 py-3 text-left ${bg} ${border}`} style={vars}>
      <span className="block text-[16px] leading-6 font-medium">{doc.title}</span>
      <span className="mt-1 line-clamp-8 block text-[14px] leading-5 text-(--md-on-surface)/80">{doc.body.map(plainText).join(" ")}</span>
    </button>
  );
}

function Section({ title, docs, onOpen }: { title: string; docs: StickyDoc[]; onOpen: (id: string) => void }) {
  if (docs.length === 0) return null;
  return (
    <section className="px-3 pt-3">
      <h2 className="px-2 pb-2 text-[12px] font-medium tracking-wide text-(--md-on-surface-variant) uppercase">{title}</h2>
      <div className="columns-2 gap-2.5">
        {docs.map((d) => (
          <Card key={d.id} doc={d} onOpen={() => onOpen(d.id)} />
        ))}
      </div>
    </section>
  );
}

type Route = { name: "list" } | { name: "note"; id: string };

/** Google Keep: a staggered grid of coloured notes; opening one fills the screen with its colour. */
export function KeepAndroid() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const list = keepNotes.filter((n) => !q || n.title.toLowerCase().includes(q) || n.body.some((p) => plainText(p).toLowerCase().includes(q)));

  return (
    <AStack<Route>
      root={{ name: "list" }}
      render={(route, nav) => {
        const doc = route.name === "note" ? keepNotes.find((n) => n.id === route.id) : undefined;
        if (doc) {
          const { bg, vars } = noteColor(doc);
          return (
            <div className="contents" style={vars}>
              <AScreen
                onBack={nav.pop}
                bg={bg}
                actions={
                  keepPinned.has(doc.id) && (
                    <span aria-label="Pinned" className="grid size-12 place-items-center">
                      <Pin className="size-5.5 fill-current" />
                    </span>
                  )
                }
              >
                <div className="select-text px-5 pt-1">
                  <h1 className="text-[22px] leading-8">{doc.title}</h1>
                  <div className="mt-3 space-y-3 text-[16px] leading-6">
                    {doc.body.map((p, i) => (
                      <RichParagraph key={i} p={p} />
                    ))}
                  </div>
                  {doc.links && (
                    <p className="mt-4 flex flex-wrap gap-2">
                      {doc.links.map((l) => (
                        <ExtLink key={l.label} href={l.href} className="rounded-lg border border-(--md-on-surface)/25 px-3 py-1.5 text-[14px]">
                          {l.label}
                        </ExtLink>
                      ))}
                    </p>
                  )}
                  <p className="mt-8 text-center text-[12px] text-(--md-on-surface-variant)">{doc.date === "Pinned" ? "Edited just now" : `Edited ${doc.date}`}</p>
                </div>
              </AScreen>
            </div>
          );
        }
        const open = (id: string) => nav.push({ name: "note", id });
        return (
          <AScreen
            header={
              <SearchBar
                value={query}
                onChange={setQuery}
                placeholder="Search your notes"
                leading={<Menu className="size-6" />}
                trailing={<Avatar initials={profile.initials} colors={["#a78bfa", "#6d28d9"]} size={32} />}
              />
            }
          >
            {list.length === 0 && <p className="px-6 pt-6 text-[14px] text-(--md-on-surface-variant)">No matching notes</p>}
            <Section title="Pinned" docs={list.filter((n) => keepPinned.has(n.id))} onOpen={open} />
            <Section title="Others" docs={list.filter((n) => !keepPinned.has(n.id))} onOpen={open} />
          </AScreen>
        );
      }}
    />
  );
}
