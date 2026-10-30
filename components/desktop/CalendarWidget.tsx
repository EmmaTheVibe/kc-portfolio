"use client";

import { useNow } from "@/lib/useNow";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

/** macOS-style small Calendar widget: this month's grid with today circled. Sits beneath every window. */
export function CalendarWidget({ className = "" }: { className?: string }) {
  const now = new Date(useNow());
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const offset = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells = [...Array<null>(offset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];

  return (
    <div
      role="img"
      aria-label={now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
      className={`${className} flex size-41 flex-col rounded-[22px] border border-black/5 bg-white/80 px-3 pt-3 pb-2 text-black shadow-[0_8px_30px_rgba(0,0,0,.2)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#1f1f22]/80 dark:text-white`}
    >
      <p className="pl-1 text-[10px] leading-none font-bold tracking-wide text-[#ff3b30]">
        {now.toLocaleDateString("en-US", { month: "long" }).toUpperCase()}
      </p>
      <div className="mt-1.5 grid flex-1 grid-cols-7 content-between text-center text-[9.5px] leading-none font-semibold tabular-nums">
        {WEEKDAYS.map((d, i) => (
          <span key={i} className="pb-0.5 opacity-50">
            {d}
          </span>
        ))}
        {cells.map((d, i) => {
          const weekend = i % 7 === 0 || i % 7 === 6;
          return (
            <span key={i} className="grid place-items-center">
              {d && (
                <span
                  className={`grid size-4.25 place-items-center rounded-full ${
                    d === today ? "bg-[#ff3b30] text-white" : weekend ? "opacity-50" : ""
                  }`}
                >
                  {d}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
