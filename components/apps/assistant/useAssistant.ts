"use client";

import { useEffect, useRef, useState } from "react";
import { reply } from "@/content/assistant";

export type ChatMessage = { role: "user" | "assistant"; text: string };

export function useAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [thinking, setThinking] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || thinking) return;
    setMessages((m) => [...m, { role: "user", text: t }]);
    setThinking(true);
    timer.current = window.setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", text: reply(t) }]);
      setThinking(false);
    }, 700);
  };

  return { messages, thinking, send, reset: () => setMessages([]) };
}
