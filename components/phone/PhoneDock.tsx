import { phoneDock, type PhoneAppId } from "@/lib/apps";
import { HomeIcon } from "./HomeIcon";

/** Static glass dock: no labels, no magnification, no running dots. */
export function PhoneDock({
  onOpen,
  hiddenIcon,
}: {
  onOpen: (id: PhoneAppId, el: HTMLElement) => void;
  hiddenIcon: PhoneAppId | null;
}) {
  return (
    <div
      className="mx-3 flex h-22 shrink-0 items-center justify-around rounded-4xl bg-white/25 px-3 backdrop-blur-2xl dark:bg-black/25"
      style={{ marginBottom: "calc(max(env(safe-area-inset-bottom), 12px) + 8px)" }}
    >
      {phoneDock.map((id) => (
        <div key={id} className="w-15">
          <HomeIcon icon={id} appId={id} label={false} hidden={id === hiddenIcon} onOpen={(el) => onOpen(id, el)} />
        </div>
      ))}
    </div>
  );
}
