"use client";

import { useState } from "react";
import { phoneHomePages, type PhoneAppId } from "@/lib/apps";
import { AboutWidget } from "./AboutWidget";
import { HomeIcon } from "./HomeIcon";

/** Paged 4-column home grid with scroll-snap and page dots. */
export function HomeGrid({
  onOpen,
  hiddenIcon,
}: {
  onOpen: (id: PhoneAppId, el: HTMLElement) => void;
  hiddenIcon: PhoneAppId | null;
}) {
  const [page, setPage] = useState(0);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        className="no-scrollbar flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain"
        onScroll={(e) => {
          const el = e.currentTarget;
          setPage(Math.round(el.scrollLeft / el.clientWidth));
        }}
      >
        {phoneHomePages.map((items, i) => (
          <div key={i} className="w-full shrink-0 snap-start">
            <div className="grid auto-rows-19.75 grid-cols-4 gap-x-3 gap-y-7 px-5 pt-4 min-[360px]:gap-x-5 min-[360px]:px-6">
              {items.map((item, j) => {
                if (item.kind === "widget") return <AboutWidget key="widget" onOpen={(el) => onOpen("notes", el)} />;
                if (item.kind === "deco") return <HomeIcon key={item.icon} icon={item.icon} />;
                const id = item.id;
                return (
                  <HomeIcon
                    key={`${id}${j}`}
                    icon={id}
                    appId={id}
                    hidden={id === hiddenIcon}
                    onOpen={(el) => onOpen(id, el)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {phoneHomePages.length > 1 && (
        <div className="flex justify-center gap-2 py-2">
          {phoneHomePages.map((_, i) => (
            <span key={i} className={`size-1.75 rounded-full ${i === page ? "bg-white" : "bg-white/40"}`} />
          ))}
        </div>
      )}
    </div>
  );
}
