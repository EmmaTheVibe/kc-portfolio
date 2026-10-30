"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useNow } from "@/lib/useNow";
import { Flyout, acrylic } from "./Flyout";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const headFmt = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" });
const monthFmt = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

/** Notification centre and month calendar, opened from the taskbar clock. */
export function CalendarFlyout() {
  const now = new Date(useNow());
  const [offset, setOffset] = useState(0);
  const view = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const lead = view.getDay();
  const days = Array.from({ length: 42 }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1 - lead));
  const isToday = (d: Date) => d.toDateString() === now.toDateString();

  return (
    <Flyout label="Calendar" className="right-3 flex w-84 max-w-[calc(100vw-24px)] flex-col gap-3">
      <div className={`px-4 py-3 ${acrylic}`}>
        <p className="text-[14px] font-semibold">Notifications</p>
        <p className="py-4 text-center text-[13px] text-black/55 dark:text-white/55">No new notifications</p>
      </div>

      <div className={`overflow-hidden ${acrylic}`}>
        <p className="border-b border-black/8 px-4 py-3 text-[14px] font-semibold dark:border-white/8">{headFmt.format(now)}</p>
        <div className="px-3 pt-3 pb-4">
          <div className="mb-2 flex items-center justify-between pl-2">
            <span className="text-[14px] font-semibold">{monthFmt.format(view)}</span>
            <span className="flex">
              {[
                { label: "Previous month", Icon: ChevronUp, step: -1 },
                { label: "Next month", Icon: ChevronDown, step: 1 },
              ].map(({ label, Icon, step }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  onClick={() => setOffset((o) => o + step)}
                  className="grid size-8 place-items-center rounded-md hover:bg-black/5 dark:hover:bg-white/8"
                >
                  <Icon className="size-4" strokeWidth={1.75} />
                </button>
              ))}
            </span>
          </div>
          <div className="grid grid-cols-7 text-center text-[12px] tabular-nums">
            {WEEKDAYS.map((d) => (
              <span key={d} className="py-1.5 font-semibold">
                {d}
              </span>
            ))}
            {days.map((d) => (
              <span key={d.toDateString()} className="grid h-10 place-items-center">
                <span
                  className={`grid size-9 place-items-center rounded-full ${
                    isToday(d)
                      ? "bg-[#005fb8] font-semibold text-white dark:bg-[#60cdff] dark:text-black"
                      : d.getMonth() === view.getMonth()
                        ? ""
                        : "text-black/40 dark:text-white/40"
                  }`}
                >
                  {d.getDate()}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </Flyout>
  );
}
