"use client";

import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Avatar } from "../shared";
import { Bubbles, Composer } from "./Bubbles";
import { lastText, useMessages } from "./useMessages";

export function MessagesDesktop() {
  const { threads, selected, select, send } = useMessages();
  const [showThread, setShowThread] = useState(true);

  return (
    <div className="flex min-h-0 flex-1">
      <aside
        className={`os-scroll w-62.5 shrink-0 overflow-y-auto border-r border-black/10 p-2 dark:border-white/10 @max-md:w-full @max-md:border-r-0 ${
          showThread ? "@max-md:hidden" : ""
        }`}
      >
        {threads.map((t) => {
          const active = t.id === selected.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                select(t.id);
                setShowThread(true);
              }}
              className={`flex w-full gap-2.5 rounded-lg px-2.5 py-2 text-left ${
                active
                  ? "bg-accent text-white"
                  : "hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              <Avatar initials={t.initials} colors={t.colors} />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2">
                  <span className="flex-1 truncate text-[13px] font-semibold">
                    {t.name}
                  </span>
                  <span
                    className={`text-[11px] ${active ? "text-white/80" : "text-black/40 dark:text-white/40"}`}
                  >
                    {t.time}
                  </span>
                </span>
                <span
                  className={`line-clamp-2 text-[12px] leading-4 ${active ? "text-white/85" : "text-black/50 dark:text-white/50"}`}
                >
                  {lastText(t)}
                </span>
              </span>
            </button>
          );
        })}
      </aside>

      <section
        className={`flex min-w-0 flex-1 flex-col bg-white dark:bg-[#1e1e1e] ${showThread ? "" : "@max-md:hidden"}`}
      >
        <header className="flex h-11 shrink-0 items-center gap-2 border-b border-black/10 px-3 text-[13px] dark:border-white/10">
          <button
            type="button"
            aria-label="Back to conversations"
            onClick={() => setShowThread(false)}
            className="rounded p-0.5 text-black/60 hover:bg-black/5 @md:hidden dark:text-white/60 dark:hover:bg-white/10"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-black/40 dark:text-white/40">To:</span>
          <Avatar
            initials={selected.initials}
            colors={selected.colors}
            size={22}
          />
          <span className="font-semibold">{selected.name}</span>
        </header>
        <div
          data-scroller
          className="os-scroll min-h-0 flex-1 overflow-y-auto px-4 py-3"
        >
          <p className="mb-3 text-center text-[11px] text-black/40 dark:text-white/40">
            Message · 9:41 AM
          </p>
          <Bubbles thread={selected} size="desktop" />
        </div>
        <div className="shrink-0 px-3 pb-3">
          <Composer size="desktop" onSend={(text) => send(selected.id, text)} />
        </div>
      </section>
    </div>
  );
}
