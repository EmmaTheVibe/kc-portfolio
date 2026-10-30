// Shared by Notes (Projects folder), Store (listings) and Browser (favourites).
// Placeholder projects themed around Mark's real stack — swap in the real apps.
export type ProjectCategory = "Productivity" | "Finance" | "Utilities" | "Experiments";

export type Project = {
  id: string;
  name: string;
  tagline: string;
  category: ProjectCategory;
  year: number;
  date: string;
  role: string;
  stack: string[];
  /** Store page or live demo. */
  url: string;
  repo: string;
  colors: [string, string];
  description: string[];
  version: string;
  whatsNew: string;
};

export const projects: Project[] = [
  {
    id: "tidepool",
    name: "Tidepool",
    tagline: "A calm habit tracker that forgives missed days.",
    category: "Productivity",
    year: 2026,
    date: "3/12/26",
    role: "Design & build",
    stack: ["Flutter", "Dart", "Riverpod", "Firebase"],
    url: "https://example.com/tidepool",
    repo: "https://github.com/",
    colors: ["#4fd1c5", "#2563eb"],
    description: [
      "Most habit trackers punish you for missing a day. Tidepool treats streaks like tides: they go out, they come back, and the overall level is what matters.",
      "One Flutter codebase ships to iOS and Android. I designed the rolling-average scoring model, built the app end to end, and spent an unreasonable amount of time on the wave animation, which runs at a steady 120fps on ProMotion screens.",
    ],
    version: "2.1",
    whatsNew: "Home-screen widgets on both platforms, a gentler reminder schedule, and a dark mode that finally looks like the ocean at night.",
  },
  {
    id: "doorstep",
    name: "Doorstep",
    tagline: "Live parcel tracking for a local courier.",
    category: "Utilities",
    year: 2025,
    date: "10/2/25",
    role: "Lead mobile developer",
    stack: ["Flutter", "Bloc", "Google Maps", "Push notifications"],
    url: "https://example.com/doorstep",
    repo: "https://github.com/",
    colors: ["#fbbf24", "#f97316"],
    description: [
      "A courier asked for an app that tells customers when their parcel is on the doorstep. It turned out to be a good idea. Customers see the van on a live map, get a push notification when the photo proof is taken, and can leave delivery notes without phoning anyone.",
      "I led the mobile side: the customer app, a driver app that works with patchy signal, and background location that doesn't flatten anyone's battery.",
    ],
    version: "1.4",
    whatsNew: "Delivery windows narrowed to 30 minutes, plus Live Activities on iPhone.",
  },
  {
    id: "pocket-ledger",
    name: "Pocket Ledger",
    tagline: "Split bills without the awkward maths.",
    category: "Finance",
    year: 2025,
    date: "5/20/25",
    role: "Solo project",
    stack: ["Flutter", "Drift (SQLite)", "Supabase"],
    url: "https://example.com/pocket-ledger",
    repo: "https://github.com/",
    colors: ["#34d399", "#059669"],
    description: [
      "An offline-first expense splitter for trips and shared flats. It works on a plane, settles up in as few transfers as possible, and never makes anyone do long division at dinner.",
      "Built solo over a summer, with a sync layer that merges edits made by friends who were all offline at the same time.",
    ],
    version: "1.0",
    whatsNew: "Multi-currency trips and receipt scanning with on-device text recognition.",
  },
  {
    id: "desk-os",
    name: "Desk OS",
    tagline: "A portfolio that thinks it's a computer.",
    category: "Experiments",
    year: 2026,
    date: "10/29/26",
    role: "Everything",
    stack: ["Next.js", "Motion", "Tailwind CSS"],
    url: "https://example.com/",
    repo: "https://github.com/",
    colors: ["#a78bfa", "#ec4899"],
    description: [
      "You're using it. A mobile developer's portfolio had to feel like a phone, so it is one on your phone, and a desktop everywhere else.",
      "Every icon is hand-drawn SVG, the wallpaper is pure CSS, and the only animation library is Motion.",
    ],
    version: "1.0",
    whatsNew: "Initial release. Please do not try to install anything.",
  },
];
