import { Search } from "lucide-react";
import type { Paragraph } from "@/content/notes";
import type { Project } from "@/content/projects";

export function SearchField({
  value,
  onChange,
  placeholder = "Search",
  size = "desktop",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  size?: "desktop" | "phone";
}) {
  const phone = size === "phone";
  return (
    <label
      className={`flex items-center gap-1.5 bg-black/5 dark:bg-white/10 ${
        phone ? "h-9 rounded-[10px] px-2 text-[17px]" : "h-7 rounded-md px-2 text-[12px]"
      }`}
    >
      <Search className={`shrink-0 opacity-40 ${phone ? "size-4" : "size-3.5"}`} />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-black/40 dark:placeholder:text-white/40"
      />
    </label>
  );
}

export function Avatar({
  initials,
  colors,
  size = 40,
}: {
  initials: string;
  colors: [string, string];
  size?: number;
}) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(160deg, ${colors[0]}, ${colors[1]})`,
      }}
    >
      {initials}
    </span>
  );
}

export function ProjectIcon({ project, size = 56 }: { project: Project; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-[22%] font-bold text-white shadow-[inset_0_0_0_0.5px_rgba(0,0,0,.1)]"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.46,
        background: `linear-gradient(160deg, ${project.colors[0]}, ${project.colors[1]})`,
      }}
    >
      {project.name[0]}
    </span>
  );
}

/** Opens external links in a new tab; mailto links open in place. */
export function ExtLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  const external = /^https?:/.test(href);
  return (
    <a
      href={href}
      className={className}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}

export function RichParagraph({ p, className }: { p: Paragraph; className?: string }) {
  if (typeof p === "string") return <p className={className}>{p}</p>;
  return (
    <p className={className}>
      {p.map((s, i) =>
        typeof s === "string" ? (
          s
        ) : (
          <ExtLink key={i} href={s.href} className="underline underline-offset-2">
            {s.text}
          </ExtLink>
        ),
      )}
    </p>
  );
}

export function openExternal(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}
