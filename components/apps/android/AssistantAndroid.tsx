"use client";

import { recents } from "@/content/assistant";
import { profile } from "@/content/profile";
import { AScreen } from "../../android/Material";
import { SparkMark } from "../../icons/Glyphs";
import { AssistantComposer, ChatLog } from "../assistant/Chat";
import { useAssistant } from "../assistant/useAssistant";

/** The assistant is a third-party app with its own look everywhere; only the frame is Android's. */
export function AssistantAndroid() {
  const { messages, thinking, send, reset } = useAssistant();

  return (
    <AScreen
      title="Assistant"
      bg="bg-[#faf9f7] dark:bg-[#1f1e1d]"
      actions={
        messages.length > 0 && (
          <button type="button" onClick={reset} className="mr-2 rounded-full px-3 py-2 text-[14px] font-medium">
            New chat
          </button>
        )
      }
      bottom={
        <div className="px-3 pt-1 pb-2">
          <AssistantComposer onSend={send} size="phone" />
        </div>
      }
    >
      <div className="px-4 pt-2 pb-4">
        {messages.length === 0 ? (
          <>
            <h2 className="mt-6 mb-6 flex items-center justify-center gap-2 text-[24px]">
              <SparkMark className="size-6" />
              Hey there, {profile.name} 👋
            </h2>
            <h3 className="mb-2 text-[14px] font-medium text-black/60 dark:text-white/60">Recents</h3>
            <div className="flex flex-col gap-2.5">
              {recents.map((r) => (
                <button
                  key={r.title}
                  type="button"
                  onClick={() => send(r.title)}
                  className="rounded-2xl border border-black/10 bg-white p-3.5 text-left dark:border-white/10 dark:bg-white/5"
                >
                  <span className="block truncate text-[15px] font-medium">{r.title}</span>
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
    </AScreen>
  );
}
