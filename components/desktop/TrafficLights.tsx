import type { ReactNode } from "react";
import { TLClose, TLMin, TLZoom } from "../icons/Glyphs";

type Props = {
  focused: boolean;
  maximizable: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onZoom: () => void;
};

// Unfocused windows show grey lights that light up when the group is hovered.
const COLORS = {
  close: ["bg-tl-close", "group-hover:bg-tl-close"],
  min: ["bg-tl-min", "group-hover:bg-tl-min"],
  zoom: ["bg-tl-zoom", "group-hover:bg-tl-zoom"],
} as const;

function Light({
  color,
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  color: keyof typeof COLORS;
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  const [on, hoverOn] = COLORS[color];
  const fill = disabled
    ? "bg-black/15 dark:bg-white/20"
    : active
      ? on
      : `bg-black/15 dark:bg-white/20 ${hoverOn}`;
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`traffic-light relative grid size-3 cursor-default place-items-center rounded-full border border-black/12 ${fill}`}
    >
      {!disabled && (
        <span className="opacity-0 transition-opacity duration-100 group-hover:opacity-100">{children}</span>
      )}
    </button>
  );
}

export function TrafficLights({ focused, maximizable, onClose, onMinimize, onZoom }: Props) {
  return (
    <div className="group flex items-center gap-2" onPointerDown={(e) => e.stopPropagation()}>
      <Light color="close" label="Close window" active={focused} onClick={onClose}>
        <TLClose className="block size-2" />
      </Light>
      <Light color="min" label="Minimize window" active={focused} onClick={onMinimize}>
        <TLMin className="block size-2" />
      </Light>
      <Light color="zoom" label="Zoom window" active={focused} disabled={!maximizable} onClick={onZoom}>
        <TLZoom className="block size-2" />
      </Light>
    </div>
  );
}
