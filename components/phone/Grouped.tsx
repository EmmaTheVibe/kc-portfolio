import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

/** Inset grouped list card, iOS settings-style. */
export function GroupedSection({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="mb-5">
      {title && <h2 className="px-5 pb-1.5 text-[20px] leading-[25px] font-bold">{title}</h2>}
      <div className="mx-4 overflow-hidden rounded-xl bg-white dark:bg-[#1c1c1e]">{children}</div>
    </section>
  );
}

export function GroupedRow({
  onClick,
  children,
  leading,
  chevron = true,
}: {
  onClick?: () => void;
  children: ReactNode;
  leading?: ReactNode;
  chevron?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group/row flex w-full items-center gap-3 pl-4 text-left active:bg-black/5 dark:active:bg-white/10"
    >
      {leading}
      <div className="flex min-w-0 flex-1 items-center gap-2 border-b-[0.5px] border-black/12 py-2.5 pr-3 group-last/row:border-b-0 dark:border-white/15">
        <div className="min-w-0 flex-1">{children}</div>
        {chevron && <ChevronRight className="size-4 shrink-0 text-black/25 dark:text-white/30" />}
      </div>
    </button>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid rounded-[9px] bg-black/[.06] p-0.5 text-[13px] dark:bg-white/10" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`rounded-[7px] py-1 ${o === value ? "bg-white font-semibold shadow-sm dark:bg-white/25" : ""}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
