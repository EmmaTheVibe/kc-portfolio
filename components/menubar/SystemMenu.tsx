import { popoverPanel } from "./StatusPopover";

const items: (string | null)[] = [
  "About This Site",
  null,
  "Settings…",
  "App Store…",
  null,
  "Sleep",
  "Restart…",
  "Shut Down…",
  null,
  "Lock Screen",
];

export function SystemMenu({ onAbout, onSettings, onLock }: { onAbout: () => void; onSettings: () => void; onLock: () => void }) {
  const actions: Record<string, () => void> = {
    "About This Site": onAbout,
    "Settings…": onSettings,
    Sleep: onLock,
    "Lock Screen": onLock,
  };

  return (
    <div role="menu" className={`absolute left-0 top-full z-9002 mt-1.5 w-55 ${popoverPanel}`}>
      {items.map((label, i) =>
        label === null ? (
          <div key={i} className="mx-2.5 my-1 h-px bg-black/10 dark:bg-white/15" />
        ) : actions[label] ? (
          <button
            key={label}
            role="menuitem"
            type="button"
            onClick={actions[label]}
            className="block w-full rounded-md px-2.5 py-1 text-left text-[13px] hover:bg-accent hover:text-white"
          >
            {label}
          </button>
        ) : (
          <div key={label} role="menuitem" aria-disabled className="px-2.5 py-1 text-[13px] text-black/30 dark:text-white/30">
            {label}
          </div>
        ),
      )}
    </div>
  );
}
