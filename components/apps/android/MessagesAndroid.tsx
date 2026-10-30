"use client";

import { Mic, Plus, Search, SendHorizontal, Smile } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Thread } from "@/content/messages";
import { profile } from "@/content/profile";
import { AScreen, AStack, ListItem } from "../../android/Material";
import { lastText, useMessages } from "../messages/useMessages";
import { Avatar } from "../shared";

/** Google Messages bubbles: sent ones in the primary container, received ones grey; corners tighten within a run. */
function Conversation({ thread }: { thread: Thread }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = endRef.current?.closest("[data-scroller]");
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }, [thread.messages.length, thread.id]);

  return (
    <div className="flex select-text flex-col gap-0.5 px-3 pt-2 pb-3 text-[16px] leading-5.5">
      <p className="mb-3 text-center text-[12px] text-(--md-on-surface-variant)">Today • 9:41 AM</p>
      {thread.messages.map((m, i) => {
        const mine = m.from === "me";
        const prev = thread.messages[i - 1];
        const next = thread.messages[i + 1];
        const first = prev?.from !== m.from;
        const last = next?.from !== m.from;
        const r = mine
          ? `rounded-l-[20px] ${first ? "rounded-tr-[20px]" : "rounded-tr-md"} ${last ? "rounded-br-[20px]" : "rounded-br-md"}`
          : `rounded-r-[20px] ${first ? "rounded-tl-[20px]" : "rounded-tl-md"} ${last ? "rounded-bl-[20px]" : "rounded-bl-md"}`;
        return (
          <div key={i} className={`flex ${mine ? "justify-end" : "justify-start"} ${first && i ? "mt-2" : ""}`}>
            <span
              className={`max-w-[78%] px-4 py-2.5 ${r} ${
                mine ? "bg-(--md-primary-container) text-(--md-on-primary-container)" : "bg-(--md-surface-container-high)"
              }`}
            >
              {m.sender && first && <span className="mb-0.5 block text-[12px] text-(--md-on-surface-variant)">{m.sender}</span>}
              {m.text}
            </span>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}

function Composer({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState("");
  return (
    <form
      className="flex items-center gap-1 px-2 py-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSend(text);
        setText("");
      }}
    >
      <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full text-(--md-on-surface-variant)">
        <Plus className="size-6" />
      </span>
      <label className="flex h-12 min-w-0 flex-1 items-center gap-2 rounded-full bg-(--md-surface-container-high) pr-2 pl-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoComplete="off"
          placeholder="RCS message"
          aria-label="Message"
          className="min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-(--md-on-surface-variant)"
        />
        <Smile aria-hidden className="size-5.5 shrink-0 text-(--md-on-surface-variant)" />
      </label>
      <button
        type="submit"
        aria-label={text.trim() ? "Send" : "Voice message"}
        className="grid size-12 shrink-0 place-items-center rounded-full bg-(--md-primary-container) text-(--md-on-primary-container)"
      >
        {text.trim() ? <SendHorizontal className="size-5.5" /> : <Mic className="size-5.5" />}
      </button>
    </form>
  );
}

type Route = { name: "list" } | { name: "thread"; id: string };

export function MessagesAndroid() {
  const { threads, send } = useMessages();

  return (
    <AStack<Route>
      root={{ name: "list" }}
      render={(route, nav) => {
        const thread = route.name === "thread" ? threads.find((t) => t.id === route.id) : undefined;
        if (thread) {
          return (
            <AScreen
              onBack={nav.pop}
              title={thread.name}
              actions={
                <span className="pr-3">
                  <Avatar initials={thread.initials} colors={thread.colors} size={32} />
                </span>
              }
              bottom={<Composer onSend={(text) => send(thread.id, text)} />}
            >
              <Conversation thread={thread} />
            </AScreen>
          );
        }
        return (
          <AScreen
            header={
              <div className="flex h-16 items-center px-1">
                <span aria-hidden className="grid size-12 place-items-center">
                  <Search className="size-6" />
                </span>
                <h1 className="flex-1 text-center text-[22px]">Messages</h1>
                <span className="grid size-12 place-items-center">
                  <Avatar initials={profile.initials} colors={["#a78bfa", "#6d28d9"]} size={32} />
                </span>
              </div>
            }
          >
            {threads.map((t) => (
              <ListItem
                key={t.id}
                onClick={() => nav.push({ name: "thread", id: t.id })}
                leading={<Avatar initials={t.initials} colors={t.colors} size={48} />}
                headline={<span className="font-medium">{t.name}</span>}
                supporting={lastText(t)}
                trailing={<span className="self-start pt-1 text-[12px] text-(--md-on-surface-variant)">{t.time}</span>}
              />
            ))}
          </AScreen>
        );
      }}
    />
  );
}
