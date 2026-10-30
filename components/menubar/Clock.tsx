"use client";

import { useNow } from "@/lib/useNow";

const dateFmt = new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" });
const timeFmt = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });

export function Clock() {
  const now = new Date(useNow());
  return (
    <span className="whitespace-nowrap px-2 tabular-nums">
      <span className="hidden min-[420px]:inline">{dateFmt.format(now).replace(",", "")}&nbsp;&nbsp;</span>
      {timeFmt.format(now)}
    </span>
  );
}
