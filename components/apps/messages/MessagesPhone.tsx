"use client";

import { ChevronRight } from "lucide-react";
import { GroupedRow } from "../../phone/Grouped";
import { BottomBar, NavScreen, NavStack } from "../../phone/NavStack";
import { Avatar } from "../shared";
import { Bubbles, Composer } from "./Bubbles";
import { lastText, useMessages } from "./useMessages";

type Route = { name: "list" } | { name: "thread"; id: string };

export function MessagesPhone() {
  const { threads, send } = useMessages();

  return (
    <NavStack<Route>
      root={{ name: "list" }}
      renderScreen={(route, nav) => {
        const thread =
          route.name === "thread"
            ? threads.find((t) => t.id === route.id)
            : undefined;
        if (thread) {
          return (
            <NavScreen
              title={thread.name}
              backLabel="Messages"
              plain
              titleNode={
                <span className="flex min-w-0 max-w-full flex-col items-center">
                  <Avatar
                    initials={thread.initials}
                    colors={thread.colors}
                    size={28}
                  />
                  <span className="mt-px flex max-w-full items-center text-[11px] leading-3.5 font-normal">
                    <span className="truncate">{thread.name}</span>
                    <ChevronRight
                      className="size-3 shrink-0 opacity-40"
                      strokeWidth={2.5}
                    />
                  </span>
                </span>
              }
              bottom={
                <BottomBar className="bg-white/90 dark:bg-black/90">
                  <Composer
                    size="phone"
                    onSend={(text) => send(thread.id, text)}
                  />
                </BottomBar>
              }
            >
              <div className="px-3 pt-2 pb-3">
                <p className="mb-3 text-center text-[12px] text-black/40 dark:text-white/40">
                  Message · 9:41 AM
                </p>
                <Bubbles thread={thread} size="phone" />
              </div>
            </NavScreen>
          );
        }
        return (
          <NavScreen title="Messages" largeTitle plain>
            <div className="mt-1">
              {threads.map((t) => (
                <GroupedRow
                  key={t.id}
                  onClick={() => nav.push({ name: "thread", id: t.id })}
                  leading={
                    <Avatar initials={t.initials} colors={t.colors} size={48} />
                  }
                >
                  <div className="flex items-baseline gap-2">
                    <span className="flex-1 truncate text-[17px] font-semibold">
                      {t.name}
                    </span>
                    <span className="text-[15px] text-black/50 dark:text-white/55">
                      {t.time}
                    </span>
                  </div>
                  <div className="line-clamp-2 text-[15px] leading-5 text-black/50 dark:text-white/55">
                    {lastText(t)}
                  </div>
                </GroupedRow>
              ))}
            </div>
          </NavScreen>
        );
      }}
    />
  );
}
