import { profile } from "./profile";
import { projects } from "./projects";

export const recents = [
  { title: "Riverpod vs Bloc, again", desc: "A calm, non-tribal comparison for a team that keeps reopening the debate.", time: "2 hours ago" },
  { title: "Why is my ListView janky?", desc: "Const constructors, itemExtent, and the image that was 4000px wide.", time: "Yesterday" },
  { title: "Name ideas for a habit app", desc: "Tidepool, Ripple, Low Tide, and a few that were frankly too nautical.", time: "3 days ago" },
  { title: "Explain platform channels like I'm five", desc: "Dart passes a note under the door and Kotlin slides one back.", time: "Last week" },
];

export const navItems = ["New chat", "Projects", "Artifacts", "Schedule"] as const;

/** A canned reply — this is a mock, not a real model. */
export function reply(text: string): string {
  const t = text.toLowerCase();
  if (/(flutter|dart|mobile|ios|android|stack|skill)/.test(t)) {
    return `${profile.name} builds iOS and Android apps with Flutter and Dart, with Riverpod or Bloc for state and Firebase or Supabase behind them. The Résumé app has the full list.`;
  }
  if (/(project|work|built|portfolio|app)/.test(t)) {
    return `${profile.name} has shipped ${projects.length} projects you can poke at: ${projects
      .map((p) => p.name)
      .join(", ")}. The Store app has a listing for each one.`;
  }
  if (/(hire|contact|email|available|job)/.test(t)) {
    return `${profile.name} is ${profile.status.toLowerCase()}. The quickest route is ${profile.email}.`;
  }
  if (/(hi|hello|hey)\b/.test(t)) return "Hello! I'm a very small, very static assistant. Ask me about projects or how to get in touch.";
  return "I'm only a mock, so I can't really think. But if I could, I'd tell you to open the Notes app — that's where the good stuff is.";
}
