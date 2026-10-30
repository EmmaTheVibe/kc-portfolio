// Windows' introduction: sticky notes on the desktop instead of the Notes app.
// Project and writing notes come from notes.ts, so both platforms say the same things.
import { notes, type Paragraph } from "./notes";
import { profile } from "./profile";
import { projects } from "./projects";

export type StickyColor = "yellow" | "green" | "pink" | "purple" | "blue" | "gray";

export type StickyDoc = {
  id: string;
  title: string;
  date: string;
  color: StickyColor;
  body: Paragraph[];
  links?: { label: string; href: string }[];
};

const about: StickyDoc = {
  id: "about",
  title: `Hi, I'm ${profile.name}.`,
  date: "Pinned",
  color: "yellow",
  body: [
    `I'm a ${profile.role.toLowerCase()}. I build iOS and Android apps with Flutter, and I like interfaces that feel physical: things that spring, snap and get out of your way.`,
    "This site is a tiny operating system. These sticky notes are the homepage, my apps are in the Microsoft Store, and everything on the taskbar opens something.",
  ],
};

const projectList: StickyDoc = {
  id: "projects",
  title: "Projects",
  date: "Pinned",
  color: "blue",
  body: [
    ...projects.map((p): Paragraph => [{ text: p.name, href: p.url }, ` — ${p.tagline}`]),
    "Full listings, screenshots and stacks are in the Microsoft Store.",
  ],
};

const contact: StickyDoc = {
  id: "contact",
  title: "Get in touch",
  date: "Pinned",
  color: "pink",
  body: [`${profile.status}. The fastest way to reach me is email.`],
  links: [
    { label: profile.email, href: `mailto:${profile.email}` },
    { label: "GitHub", href: profile.github },
    { label: "LinkedIn", href: profile.linkedin },
  ],
};

const fromNotes: StickyDoc[] = notes
  .filter((n) => n.group !== "Pinned")
  .map((n) => ({
    id: n.id,
    title: n.title,
    date: n.date,
    color: n.group === "Projects" ? "purple" : "green",
    body: n.body,
    links: n.links,
  }));

export const stickies: StickyDoc[] = [about, projectList, contact, ...fromNotes];

/** Stuck on the desktop on every visit, left to right. */
export const defaultStickies = ["about", "projects", "contact"];
