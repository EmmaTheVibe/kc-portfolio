"use client";

import { Bell, Calendar, ChevronLeft, MessageSquare, MoreHorizontal, Phone, Search, SendHorizontal, Users, Video, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Thread } from "@/content/messages";
import { profile } from "@/content/profile";
import { Avatar } from "../shared";
import { lastText, useMessages } from "../messages/useMessages";

const TEAMS = "#5b5fc7";

const rail: { label: string; icon: LucideIcon }[] = [
  { label: "Activity", icon: Bell },
  { label: "Chat", icon: MessageSquare },
  { label: "Teams", icon: Users },
  { label: "Calendar", icon: Calendar },
];

function Conversation({ thread }: { thread: Thread }) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scroller = endRef.current?.closest("[data-scroller]");
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }, [thread.messages.length, thread.id]);

  return (
    <div className="flex select-text flex-col gap-1 text-[13px] leading-[1.45]">
      {thread.messages.map((m, i) => {
        const prev = thread.messages[i - 1];
        const head = !prev || prev.from !== m.from || prev.sender !== m.sender;
        const name = m.from === "me" ? profile.fullName : (m.sender ?? thread.name);
        return m.from === "me" ? (
          <div key={i} className={`flex flex-col items-end ${head && i ? "mt-3" : ""}`}>
            {head && <span className="mb-1 text-[11px] text-black/50 dark:text-white/50">{thread.time}</span>}
            <p className="max-w-[75%] rounded-md bg-[#e8ebfa] px-3 py-2 dark:bg-[#2f2f4a]">{m.text}</p>
          </div>
        ) : (
          <div key={i} className={`flex gap-2.5 ${head && i ? "mt-3" : ""}`}>
            <span className="w-8 shrink-0">{head && <Avatar initials={name.slice(0, 2).toUpperCase()} colors={thread.colors} size={32} />}</span>
            <div className="max-w-[75%] rounded-md bg-white px-3 py-2 shadow-[0_1px_2px_rgba(0,0,0,.08)] dark:bg-[#292929]">
              {head && (
                <p className="mb-0.5 text-[11px]">
                  <span className="font-semibold">{name}</span>
                  <span className="ml-2 text-black/50 dark:text-white/50">{thread.time}</span>
                </p>
              )}
              <p>{m.text}</p>
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}

/** Microsoft Teams-style chat: app rail, chat list and conversation. */
export function TeamsWin() {
  const { threads, selected, select, send } = useMessages();
  const [showThread, setShowThread] = useState(true);
  const [draft, setDraft] = useState("");

  return (
    <div className="flex min-h-0 flex-1 bg-[#f5f5f5] dark:bg-[#1f1f1f]">
      <nav className="flex w-17 shrink-0 flex-col items-center gap-1 border-r border-black/8 pt-2 dark:border-white/8 @max-xl:hidden">
        {rail.map(({ label, icon: Icon }) => {
          const active = label === "Chat";
          return (
            <span
              key={label}
              className={`relative flex w-15 flex-col items-center gap-0.5 rounded-md py-1.5 text-[10px] ${
                active ? "font-semibold" : "text-black/60 dark:text-white/60"
              }`}
              style={active ? { color: TEAMS } : undefined}
            >
              {active && <span className="absolute top-2 bottom-2 -left-1 w-0.75 rounded-full" style={{ background: TEAMS }} />}
              <Icon className="size-5" strokeWidth={active ? 2.2 : 1.6} />
              {label}
            </span>
          );
        })}
      </nav>

      <aside
        className={`flex w-80 shrink-0 flex-col border-r border-black/8 bg-[#fafafa] dark:border-white/8 dark:bg-[#242424] @max-2xl:w-64 @max-md:w-full @max-md:border-r-0 ${
          showThread ? "@max-md:hidden" : ""
        }`}
      >
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <h1 className="text-[18px] font-bold">Chat</h1>
          <Search className="size-4 opacity-60" />
        </div>
        <div className="os-scroll min-h-0 flex-1 overflow-y-auto px-2 pb-2">
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
                className={`flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left ${
                  active ? "bg-white shadow-[0_1px_2px_rgba(0,0,0,.08)] dark:bg-[#2e2e2e]" : "hover:bg-black/4 dark:hover:bg-white/5"
                }`}
              >
                <Avatar initials={t.initials} colors={t.colors} size={32} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="flex-1 truncate text-[13px] font-semibold">{t.name}</span>
                    <span className="shrink-0 text-[11px] text-black/50 dark:text-white/50">{t.time}</span>
                  </span>
                  <span className="block truncate text-[12px] text-black/60 dark:text-white/60">{lastText(t)}</span>
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      <section className={`flex min-w-0 flex-1 flex-col ${showThread ? "" : "@max-md:hidden"}`}>
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-black/8 bg-white px-4 dark:border-white/8 dark:bg-[#292929]">
          <button
            type="button"
            aria-label="Back to chats"
            onClick={() => setShowThread(false)}
            className="rounded p-0.5 hover:bg-black/5 @md:hidden dark:hover:bg-white/10"
          >
            <ChevronLeft className="size-4" />
          </button>
          <Avatar initials={selected.initials} colors={selected.colors} size={32} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[14px] font-semibold">{selected.name}</span>
            <span className="flex gap-4 text-[12px]">
              <span className="border-b-2 font-semibold" style={{ borderColor: TEAMS }}>
                Chat
              </span>
              <span className="text-black/55 dark:text-white/55">Shared</span>
            </span>
          </span>
          <span className="flex items-center gap-1 text-black/60 dark:text-white/60">
            <Video className="size-4.5" strokeWidth={1.75} />
            <Phone className="ml-3 size-4" strokeWidth={1.75} />
            <MoreHorizontal className="ml-3 size-4.5" />
          </span>
        </header>
        <div data-scroller className="os-scroll min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <Conversation thread={selected} />
        </div>
        <form
          className="shrink-0 px-5 pb-4"
          onSubmit={(e) => {
            e.preventDefault();
            send(selected.id, draft);
            setDraft("");
          }}
        >
          <div className="flex items-center gap-2 rounded-md border border-black/10 border-b-2 bg-white px-3 py-2 dark:border-white/10 dark:bg-[#292929]" style={{ borderBottomColor: TEAMS }}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message"
              aria-label="Message"
              className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-black/45 dark:placeholder:text-white/45"
            />
            <button type="submit" aria-label="Send" disabled={!draft.trim()} className="disabled:opacity-35" style={{ color: TEAMS }}>
              <SendHorizontal className="size-4.5" />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
