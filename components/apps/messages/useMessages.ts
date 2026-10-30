"use client";

import { useState } from "react";
import { threads as initial, type Thread } from "@/content/messages";

/** Threads plus anything the visitor "sends" this session (kept in memory only). */
export function useMessages() {
  const [threads, setThreads] = useState<Thread[]>(initial);
  const [selectedId, setSelectedId] = useState(initial[0].id);

  const send = (threadId: string, text: string) => {
    const t = text.trim();
    if (!t) return;
    setThreads((all) =>
      all.map((th) =>
        th.id === threadId ? { ...th, time: "Now", messages: [...th.messages, { from: "me", text: t }] } : th,
      ),
    );
  };

  const selected = threads.find((t) => t.id === selectedId) ?? threads[0];
  return { threads, selected, select: setSelectedId, send };
}

export const lastText = (t: Thread) => t.messages[t.messages.length - 1]?.text ?? "";
