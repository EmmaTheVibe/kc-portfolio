"use client";

import { Calendar, FolderOpen, Plus, Shapes, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { navItems, recents } from "@/content/assistant";
import { profile } from "@/content/profile";
import { SparkMark } from "../../icons/Glyphs";
import { ASSISTANT_ACCENT, AssistantComposer, ChatLog } from "./Chat";
import { useAssistant } from "./useAssistant";

const navIcons: Record<(typeof navItems)[number], LucideIcon> = {
  "New chat": Plus,
  Projects: FolderOpen,
  Artifacts: Shapes,
  Schedule: Calendar,
};

export function AssistantDesktop() {
  const { messages, thinking, send, reset } = useAssistant();
  const [mode, setMode] = useState<"Home" | "Code">("Home");

  return (
    <div className="flex min-h-0 flex-1">
      <aside className="flex w-[220px] shrink-0 flex-col border-r border-black/10 p-2 dark:border-white/10">
        <div className="mb-2 grid grid-cols-2 rounded-lg bg-black/5 p-0.5 text-[12px] dark:bg-white/10">
          {(["Home", "Code"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-md py-1 ${m === mode ? "bg-white font-semibold shadow-sm dark:bg-white/20" : "text-black/55 dark:text-white/55"}`}
            >
              {m}
            </button>
          ))}
        </div>
        {navItems.map((item) => {
          const Icon = navIcons[item];
          return (
            <button
              key={item}
              type="button"
              onClick={item === "New chat" ? reset : undefined}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] hover:bg-black/5 dark:hover:bg-white/10"
            >
              <Icon className="size-4 opacity-60" />
              {item}
            </button>
          );
        })}
        <h3 className="px-2 pt-4 pb-1 text-[11px] font-semibold text-black/40 dark:text-white/40">Recents</h3>
        <div className="os-scroll min-h-0 flex-1 overflow-y-auto">
          {recents.map((r) => (
            <div key={r.title} className="truncate rounded-lg px-2 py-1 text-[12px] text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10">
              {r.title}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t border-black/10 px-1 pt-2 dark:border-white/10">
          <span className="grid size-7 place-items-center rounded-full text-[12px] font-semibold text-white" style={{ background: ASSISTANT_ACCENT }}>
            {profile.name[0]}
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[12px] font-semibold">{profile.fullName}</span>
            <span className="block text-[11px] text-black/45 dark:text-white/45">Pro plan</span>
          </span>
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col bg-[#faf9f7] dark:bg-[#1f1e1d]">
        <div data-scroller className="os-scroll min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[640px] px-6 py-8">
            {messages.length === 0 ? (
              <>
                <h1 className="mb-8 flex items-center justify-center gap-2 text-[28px] font-semibold">
                  <SparkMark className="size-7" />
                  Hey there, {profile.name} 👋
                </h1>
                <h2 className="mb-2 text-[13px] font-semibold text-black/60 dark:text-white/60">Recents</h2>
                <div className="grid grid-cols-2 gap-3">
                  {recents.map((r) => (
                    <button
                      key={r.title}
                      type="button"
                      onClick={() => send(r.title)}
                      className="rounded-xl border border-black/10 bg-white p-3 text-left hover:border-black/20 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
                    >
                      <span className="block truncate text-[13px] font-semibold">{r.title}</span>
                      <span className="mt-0.5 line-clamp-2 text-[12px] leading-4 text-black/50 dark:text-white/50">{r.desc}</span>
                      <span className="mt-2 block text-[11px] text-black/35 dark:text-white/35">{r.time}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <ChatLog messages={messages} thinking={thinking} size="desktop" />
            )}
          </div>
        </div>
        <div className="mx-auto w-full max-w-[640px] shrink-0 px-6 pb-5">
          <AssistantComposer onSend={send} size="desktop" />
        </div>
      </section>
    </div>
  );
}
