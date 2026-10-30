const timeFmt = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });
const longDateFmt = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" });

/** "9:41" — the clock as iOS shows it, without AM/PM. */
export function clockTime(ms: number) {
  return timeFmt
    .formatToParts(new Date(ms))
    .filter((p) => p.type !== "dayPeriod")
    .map((p) => p.value)
    .join("")
    .trim();
}

/** "Wednesday, October 29" (order follows the visitor's locale). */
export const longDate = (ms: number) => longDateFmt.format(new Date(ms));
