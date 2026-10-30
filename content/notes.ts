import { profile } from "./profile";
import { projects } from "./projects";

export type Inline = string | { text: string; href: string };
export type Paragraph = string | Inline[];

export const NOTE_GROUPS = ["Pinned", "Projects", "Writing"] as const;
export type NoteGroup = (typeof NOTE_GROUPS)[number];

export type Note = {
  id: string;
  group: NoteGroup;
  date: string;
  title: string;
  preview: string;
  subtitle?: string;
  byline?: string;
  meta?: { label: string; value: string }[];
  links?: { label: string; href: string }[];
  body: Paragraph[];
  comingSoon?: boolean;
};

const intro: Note = {
  id: "hello",
  group: "Pinned",
  date: "now",
  title: `Hi, I'm ${profile.name}.`,
  preview: "Welcome to my corner of the internet.",
  subtitle: "Welcome to my corner of the internet.",
  byline: "About",
  body: [
    `I'm a ${profile.role.toLowerCase()}. I build iOS and Android apps with Flutter, and I like interfaces that feel physical: things that spring, snap and get out of your way.`,
    "This site is a tiny operating system. Notes is the homepage, my apps are in the Projects folder here (and in the Store), and every icon in the dock opens something.",
    [
      "If you want to work together, the fastest way is ",
      { text: "email", href: `mailto:${profile.email}` },
      ". My code lives on ",
      { text: "GitHub", href: profile.github },
      ".",
    ],
  ],
};

const projectNotes: Note[] = projects.map((p) => ({
  id: `project-${p.id}`,
  group: "Projects",
  date: p.date,
  title: p.name,
  preview: p.tagline,
  subtitle: p.tagline,
  byline: `Project · ${p.role} · ${p.year}`,
  meta: [
    { label: "Stack", value: p.stack.join(", ") },
    { label: "Role", value: p.role },
  ],
  links: [
    { label: p.category === "Experiments" ? "Live demo" : "Get the app", href: p.url },
    { label: "Source", href: p.repo },
  ],
  body: p.description,
}));

const writing: Note[] = [
  {
    id: "momentum",
    group: "Writing",
    date: "7/15/26",
    title: "On Momentum",
    preview: "What happens when you keep going…",
    subtitle: "Small steps, compounded.",
    byline: `Writing · ${profile.name} · July 2026`,
    body: [
      "The hardest part of any project is the third week. The novelty has worn off, the finish line isn't visible yet, and every task looks like a chore.",
      "What gets me through is shrinking the unit of progress. Not 'build the sync engine' but 'make the pull-to-refresh spinner spin'. A spinner is boring, but it's done, and done things are oddly motivating.",
      "Momentum isn't a mood. It's a pile of small finished things that gets tall enough to lean on.",
    ],
  },
  {
    id: "springs",
    group: "Writing",
    date: "4/3/26",
    title: "Why Everything Here Springs",
    preview: "A short defence of physics-based animation.",
    subtitle: "Easing curves are a guess. Springs are a model.",
    byline: `Writing · ${profile.name} · April 2026`,
    body: [
      "A duration-based animation has to decide in advance how long it lasts. A spring just knows where it wants to be and how stiff it is, so it can be interrupted halfway through and still look right.",
      [
        "It's why iOS feels the way it does, why Flutter ships a SpringSimulation, and why the windows on this site use springs for opening and maximising. Grab one mid-animation and nothing jumps. If you want the maths, ",
        { text: "this explainer", href: "https://example.com/springs" },
        " is the clearest I've found.",
      ],
    ],
  },
  {
    id: "cities",
    group: "Writing",
    date: "3/1/25",
    title: "Cities at Night",
    preview: "Notes from a long walk…",
    subtitle: "Every lit window is a tiny user interface.",
    byline: `Writing · ${profile.name} · March 2025`,
    body: [
      "I walked home across the whole city once, mostly to avoid a taxi queue. Somewhere around the second hour I started counting lit windows and wondering what each person was looking at.",
      "Laptop glow, television flicker, one person ironing at 2am. Cities at night are just thousands of screens, and everyone behind them is a user someone designed for.",
    ],
  },
  {
    id: "coming-soon",
    group: "Writing",
    date: "10/2/26",
    title: "Coming Soon",
    preview: "Writing · October 2026",
    body: ["Draft in progress. It's about Flutter state management, and I've already changed my mind twice."],
    comingSoon: true,
  },
];

export const notes: Note[] = [intro, ...projectNotes, ...writing];

export function plainText(p: Paragraph): string {
  return typeof p === "string" ? p : p.map((s) => (typeof s === "string" ? s : s.text)).join("");
}
