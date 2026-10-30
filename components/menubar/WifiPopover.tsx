import { Lock, Wifi } from "lucide-react";
import { connectedNetwork, otherNetworks } from "@/content/wifi";
import { WifiStrength } from "../icons/Glyphs";
import { PopDivider, PopHeading, PopLabel, PopRow, StatusPopover } from "./StatusPopover";

export function WifiPopover() {
  return (
    <StatusPopover>
      <PopHeading title="Wi‑Fi" />
      <PopDivider />
      <PopLabel>Known Network</PopLabel>
      <PopRow>
        <span className="grid size-6 place-items-center rounded-full bg-accent text-white">
          <Wifi className="size-3.5" strokeWidth={2.5} />
        </span>
        <span className="flex-1 truncate">{connectedNetwork}</span>
        <Lock className="size-[11px] opacity-50" />
      </PopRow>
      <PopLabel>Other Networks</PopLabel>
      {otherNetworks.map((n) => (
        <PopRow key={n.name}>
          <span className="grid size-6 place-items-center rounded-full bg-black/10 dark:bg-white/15">
            <WifiStrength bars={n.bars} className="w-3.5" />
          </span>
          <span className="flex-1 truncate">{n.name}</span>
          {n.locked && <Lock className="size-[11px] opacity-50" />}
        </PopRow>
      ))}
      <PopDivider />
      <PopRow>Wi‑Fi Settings…</PopRow>
    </StatusPopover>
  );
}
