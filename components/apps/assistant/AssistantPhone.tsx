"use client";

import { useState } from "react";
import { recents } from "@/content/assistant";
import { profile } from "@/content/profile";
import { SparkMark } from "../../icons/Glyphs";
import { Segmented } from "../../phone/Grouped";
import { BottomBar, NavScreen } from "../../phone/NavStack";
import { AssistantComposer, ChatLog } from "./Chat";
import { useAssistant } from "./useAssistant";

const modes = ["Home", "Code"] as const;

export function AssistantPhone() {
  const { messages, thinking, send, reset } = useAssistant();
  const [mode, setMode] = useState<(typeof modes)[number]>("Home");

  return (
    <NavScreen
      title="Assistant"
      bgClass="bg-[#faf9f7] dark:bg-[#1f1e1d]"
      trailing={
        messages.length > 0 && (
          <button type="button" onClick={reset} className="text-[17px]">
            New
          </button>
        )
      }
      bottom={
        <BottomBar className="border-transparent">
          <AssistantComposer onSend={send} size="phone" />
        </BottomBar>
      }
    >
      <div className="px-4 pt-2 pb-4">
        {messages.length === 0 ? (
          <>
            <Segmented options={modes} value={mode} onChange={setMode} />
            <h1 className="mt-8 mb-6 flex items-center justify-center gap-2 text-[26px] font-semibold">
              <SparkMark className="size-6" />
              Hey there, {profile.name} 👋
            </h1>
            <h2 className="mb-2 text-[15px] font-semibold text-black/60 dark:text-white/60">Recents</h2>
            <div className="flex flex-col gap-2.5">
              {recents.map((r) => (
                <button
                  key={r.title}
                  type="button"
                  onClick={() => send(r.title)}
                  className="rounded-xl border border-black/10 bg-white p-3.5 text-left dark:border-white/10 dark:bg-white/5"
                >
                  <span className="block truncate text-[15px] font-semibold">{r.title}</span>
                  <span className="mt-0.5 line-clamp-2 text-[13px] leading-[18px] text-black/50 dark:text-white/50">{r.desc}</span>
                  <span className="mt-2 block text-[12px] text-black/35 dark:text-white/35">{r.time}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <ChatLog messages={messages} thinking={thinking} size="phone" />
        )}
      </div>
    </NavScreen>
  );
}
