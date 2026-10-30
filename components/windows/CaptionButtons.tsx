type Props = {
  focused: boolean;
  maximizable: boolean;
  maximized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
};

const btn = "grid h-8 w-11.5 place-items-center transition-colors duration-100";
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1, vectorEffect: "non-scaling-stroke" } as const;

/** Windows 11 minimise / maximise / close buttons, flush with the window's top-right corner. */
export function CaptionButtons({ focused, maximizable, maximized, onClose, onMinimize, onToggleMaximize }: Props) {
  const glyph = `size-2.5 ${focused ? "" : "opacity-45"}`;
  return (
    <div
      className="flex self-stretch"
      onPointerDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <button type="button" aria-label="Minimize" onClick={onMinimize} className={`${btn} hover:bg-black/6 dark:hover:bg-white/8`}>
        <svg viewBox="0 0 10 10" className={glyph} aria-hidden>
          <path d="M0 5h10" {...stroke} />
        </svg>
      </button>
      <button
        type="button"
        aria-label={maximized ? "Restore" : "Maximize"}
        disabled={!maximizable}
        onClick={onToggleMaximize}
        className={`${btn} hover:bg-black/6 disabled:opacity-35 disabled:hover:bg-transparent dark:hover:bg-white/8`}
      >
        <svg viewBox="0 0 10 10" className={glyph} aria-hidden>
          {maximized ? (
            <>
              <rect x=".5" y="2.5" width="7" height="7" rx="1.2" {...stroke} />
              <path d="M2.5 2.5v-.7A1.3 1.3 0 0 1 3.8.5h4.4a1.3 1.3 0 0 1 1.3 1.3v4.4a1.3 1.3 0 0 1-1.3 1.3h-.7" {...stroke} />
            </>
          ) : (
            <rect x=".5" y=".5" width="9" height="9" rx="1.5" {...stroke} />
          )}
        </svg>
      </button>
      <button type="button" aria-label="Close" onClick={onClose} className={`${btn} hover:bg-[#c42b1c] hover:text-white`}>
        <svg viewBox="0 0 10 10" className={glyph} aria-hidden>
          <path d="M.5.5l9 9M9.5.5l-9 9" {...stroke} />
        </svg>
      </button>
    </div>
  );
}
