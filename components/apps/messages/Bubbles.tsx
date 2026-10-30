"use client";

import { useEffect, useRef } from "react";
import type { Thread } from "@/content/messages";

/** Message bubbles, auto-scrolled to the newest message. */
export function Bubbles({
  thread,
  size,
}: {
  thread: Thread;
  size: "desktop" | "phone";
}) {
  const endRef = useRef<HTMLDivElement>(null);
  const phone = size === "phone";

  // Scroll the nearest marked scroller directly; scrollIntoView would also nudge the page.
  useEffect(() => {
    const scroller = endRef.current?.closest("[data-scroller]");
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }, [thread.messages.length, thread.id]);

  return (
    <div
      className={`flex select-text flex-col gap-1 ${phone ? "text-[17px] leading-5.5" : "text-[13px] leading-4.5"}`}
    >
      {thread.messages.map((m, i) => {
        const prev = thread.messages[i - 1];
        const showSender = m.sender && prev?.sender !== m.sender;
        const groupStart = !prev || prev.from !== m.from;
        return (
          <div
            key={i}
            className={`flex flex-col ${m.from === "me" ? "items-end" : "items-start"} ${groupStart && i ? "mt-2" : ""}`}
          >
            {showSender && (
              <span className="mb-0.5 ml-3 text-[11px] text-black/45 dark:text-white/45">
                {m.sender}
              </span>
            )}
            <span
              className={`max-w-[70%] rounded-[18px] ${phone ? "px-3.5 py-2" : "px-3 py-1.5"} ${
                m.from === "me"
                  ? "bg-accent text-white"
                  : "bg-[#e9e9eb] text-black dark:bg-[#3b3b3d] dark:text-white"
              }`}
            >
              {m.text}
            </span>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}

export function Composer({
  onSend,
  size,
}: {
  onSend: (text: string) => void;
  size: "desktop" | "phone";
}) {
  const phone = size === "phone";
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem(
          "msg",
        ) as HTMLInputElement;
        onSend(input.value);
        input.value = "";
      }}
    >
      <input
        name="msg"
        autoComplete="off"
        placeholder="Message"
        className={`w-full rounded-full border border-black/15 bg-transparent outline-none placeholder:text-black/35 dark:border-white/20 dark:placeholder:text-white/35 ${
          phone ? "h-9 px-4 text-[17px]" : "h-7 px-3 text-[13px]"
        }`}
      />
    </form>
  );
}
