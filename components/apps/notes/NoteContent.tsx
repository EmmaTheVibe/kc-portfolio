import type { Note } from "@/content/notes";
import { ExtLink, RichParagraph } from "../shared";

/** Title, byline and body of a note. Shared by the desktop and phone views. */
export function NoteContent({ note, size }: { note: Note; size: "desktop" | "phone" }) {
  const phone = size === "phone";
  return (
    <div className={`select-text ${phone ? "text-[17px] leading-[1.5]" : "text-[13px] leading-[1.625]"}`}>
      <h1 className={`font-bold ${phone ? "mb-1 text-[28px] leading-[34px]" : "mb-0.5 text-[20px] leading-7"}`}>
        {note.title}
      </h1>
      {note.subtitle && <p className="italic">{note.subtitle}</p>}
      {note.byline && <p className="mb-3 text-black/50 dark:text-white/50">{note.byline}</p>}

      {note.meta && (
        <dl className="mb-3 grid grid-cols-[auto_1fr] gap-x-3 rounded-lg bg-black/[.03] px-3 py-2 dark:bg-white/5">
          {note.meta.map((m) => (
            <div key={m.label} className="contents">
              <dt className="text-black/45 dark:text-white/45">{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {note.body.map((p, i) => (
        <RichParagraph key={i} p={p} className={`mb-2 ${note.comingSoon ? "text-black/45 dark:text-white/45" : ""}`} />
      ))}

      {note.links && (
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          {note.links.map((l) => (
            <ExtLink key={l.label} href={l.href} className="text-accent underline underline-offset-2">
              {l.label} ↗
            </ExtLink>
          ))}
        </p>
      )}
    </div>
  );
}
