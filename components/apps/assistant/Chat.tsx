"use client";

import { ArrowUp, ChevronDown, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SparkMark } from "../../icons/Glyphs";
import type { ChatMessage } from "./useAssistant";

export const ASSISTANT_ACCENT = "#d97757";

export function AssistantComposer({ onSend, size }: { onSend: (text: string) => void; size: "desktop" | "phone" }) {
  const [text, setText] = useState("");
  const phone = size === "phone";
  const submit = () => {
    onSend(text);
    setText("");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="rounded-2xl border border-black/10 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#2b2b2d]"
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        rows={phone ? 1 : 2}
        placeholder="How can I help you today?"
        className={`w-full resize-none bg-transparent outline-none placeholder:text-black/40 dark:placeholder:text-white/40 ${
          phone ? "text-[17px]" : "text-[13px]"
        }`}
      />
      <div className="mt-1 flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-lg border border-black/10 text-black/50 dark:border-white/10 dark:text-white/50">
          <Plus className="size-4" />
        </span>
        <div className="flex-1" />
        <span className="flex items-center gap-0.5 text-[12px] text-black/50 dark:text-white/50">
          Model 5 <ChevronDown className="size-3" />
        </span>
        <button
          type="submit"
          aria-label="Send"
          disabled={!text.trim()}
          className="grid size-7 place-items-center rounded-full text-white disabled:opacity-40"
          style={{ background: ASSISTANT_ACCENT }}
        >
          <ArrowUp className="size-4" strokeWidth={2.5} />
        </button>
      </div>
    </form>
  );
}

export function ChatLog({ messages, thinking, size }: { messages: ChatMessage[]; thinking: boolean; size: "desktop" | "phone" }) {
  const endRef = useRef<HTMLDivElement>(null);
  const phone = size === "phone";

  useEffect(() => {
    const scroller = endRef.current?.closest("[data-scroller]");
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }, [messages.length, thinking]);

  return (
    <div className={`flex select-text flex-col gap-4 ${phone ? "text-[17px] leading-relaxed" : "text-[13px] leading-relaxed"}`}>
      {messages.map((m, i) =>
        m.role === "user" ? (
          <p key={i} className="max-w-[80%] self-end rounded-2xl bg-black/5 px-3.5 py-2 dark:bg-white/10">
            {m.text}
          </p>
        ) : (
          <div key={i} className="flex gap-2.5">
            <SparkMark className="mt-0.5 size-5 shrink-0" />
            <p>{m.text}</p>
          </div>
        ),
      )}
      {thinking && (
        <div className="flex gap-2.5">
          <SparkMark className="size-5 shrink-0 animate-pulse" />
          <span className="text-black/40 dark:text-white/40">Thinking…</span>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
