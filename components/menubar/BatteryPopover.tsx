import { Check } from "lucide-react";
import { PopDivider, PopHeading, PopLabel, PopRow, StatusPopover } from "./StatusPopover";

const modes = ["Low Power", "Automatic", "High Power"];
const hogs = ["Browser", "Assistant", "Thirty-Seven Open Tabs"];

export function BatteryPopover() {
  return (
    <StatusPopover>
      <PopHeading title="Battery" meta="87%" />
      <div className="px-2.5 pb-1 text-[12px] text-black/45 dark:text-white/45">Power Source: Battery</div>
      <PopDivider />
      <PopLabel>Energy Mode</PopLabel>
      {modes.map((m) => (
        <PopRow key={m}>
          <span className="flex-1">{m}</span>
          {m === "Automatic" && <Check className="size-3.5 text-accent" strokeWidth={3} />}
        </PopRow>
      ))}
      <PopDivider />
      <PopLabel>Using Significant Energy</PopLabel>
      {hogs.map((h) => (
        <PopRow key={h}>
          <span className="size-4 rounded bg-black/15 dark:bg-white/20" />
          <span className="flex-1 truncate">{h}</span>
        </PopRow>
      ))}
      <PopDivider />
      <PopRow>Battery Settings…</PopRow>
    </StatusPopover>
  );
}
