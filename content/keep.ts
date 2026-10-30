// Android's introduction: Google Keep notes instead of the Notes app. The contact note and the
// project and writing notes are the same ones Sticky Notes shows, so every platform says the same things.
import type { Paragraph } from "./notes";
import { profile } from "./profile";
import { projects } from "./projects";
import { stickies, type StickyDoc } from "./stickies";

const about: StickyDoc = {
  id: "about",
  title: `Hi, I'm ${profile.name}.`,
  date: "Pinned",
  color: "yellow",
  body: [
    `I'm a ${profile.role.toLowerCase()}. I build iOS and Android apps with Flutter, and I like interfaces that feel physical: things that spring, snap and get out of your way.`,
    "This site is a tiny phone. These Keep notes are the homepage, my apps are in the Play Store, and every icon on the home screen opens something.",
  ],
};

const projectList: StickyDoc = {
  id: "projects",
  title: "Projects",
  date: "Pinned",
  color: "blue",
  body: [
    ...projects.map((p): Paragraph => [{ text: p.name, href: p.url }, ` — ${p.tagline}`]),
    "Full listings, screenshots and stacks are in the Play Store.",
  ],
};

export const keepNotes: StickyDoc[] = [about, projectList, ...stickies.filter((s) => s.id !== "about" && s.id !== "projects")];

/** Shown under "Pinned"; everything else is under "Others". */
export const keepPinned = new Set(["about", "projects", "contact"]);
