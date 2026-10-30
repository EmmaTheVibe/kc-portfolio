// Placeholder CV themed around Mark's stack — replace the companies, dates and numbers with the real ones.
export const resume = {
  summary:
    "Mobile app developer building cross-platform apps for iOS and Android with Flutter. I care about smooth animation, offline-first apps that survive bad signal, and shipping things people enjoy using.",
  experience: [
    {
      company: "Brightline Studio",
      role: "Senior Mobile Developer",
      period: "2023 — Present",
      location: "Remote",
      bullets: [
        "Led the move of two native apps to a single Flutter codebase, halving release time.",
        "Built a shared widget library and motion system used across four product teams.",
        "Cut cold-start time by 40% by profiling with DevTools and deferring heavy plugins.",
      ],
    },
    {
      company: "Northwind Labs",
      role: "Flutter Developer",
      period: "2021 — 2023",
      location: "Hybrid",
      bullets: [
        "Shipped a field-service app used by 10k technicians, from prototype to App Store and Play Store.",
        "Introduced golden tests and CI builds with Codemagic, catching 200+ UI regressions before release.",
      ],
    },
    {
      company: "Freelance",
      role: "Mobile Developer",
      period: "2019 — 2021",
      location: "Wherever the wifi was",
      bullets: ["Built apps for small businesses, cafés and one very particular dentist."],
    },
  ],
  education: [{ school: "State University", degree: "BSc Computer Science", period: "2015 — 2019" }],
  skills: [
    { group: "Languages", items: ["Dart", "Kotlin", "Swift", "TypeScript"] },
    { group: "Mobile", items: ["Flutter", "Riverpod", "Bloc", "Firebase", "Supabase", "Platform channels"] },
    { group: "Craft", items: ["Animation", "Offline-first", "Accessibility", "Performance", "App Store releases"] },
  ],
};
