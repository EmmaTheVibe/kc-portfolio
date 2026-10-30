import { profile } from "@/content/profile";
import { ExtLink } from "./shared";

export const aboutSpecs = [
  ["Built with", "Next.js"],
  ["Motion", "Framer Motion"],
  ["Styled with", "Tailwind CSS"],
  ["Hosted on", "Vercel"],
  ["Version", "1.0"],
];

function Laptop() {
  return (
    <svg viewBox="0 0 200 130" className="w-[180px]" aria-hidden>
      <defs>
        <linearGradient id="about-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9db4e2" />
          <stop offset="1" stopColor="#e2af97" />
        </linearGradient>
      </defs>
      <rect x="28" y="6" width="144" height="98" rx="8" fill="#2c2c2e" />
      <rect x="34" y="12" width="132" height="86" rx="3" fill="url(#about-screen)" />
      <path d="M8 108h184l-6 10a6 6 0 0 1-5 3H19a6 6 0 0 1-5-3Z" fill="#c7c7cc" />
      <rect x="84" y="108" width="32" height="3" rx="1.5" fill="#a1a1a6" />
    </svg>
  );
}

export function AboutWindow() {
  return (
    <div className="flex flex-1 flex-col items-center px-6 pt-2 pb-4 text-center">
      <Laptop />
      <h1 className="mt-4 text-[18px] font-semibold">Desk OS</h1>
      <p className="text-[12px] text-black/50 dark:text-white/50">v1.0, 2026</p>

      <dl className="mt-5 grid w-full grid-cols-2 gap-x-3 gap-y-1 text-[12px]">
        {aboutSpecs.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-right text-black/50 dark:text-white/50">{k}</dt>
            <dd className="text-left">{v}</dd>
          </div>
        ))}
      </dl>

      <ExtLink
        href={profile.github}
        className="mt-5 rounded-md border border-black/10 bg-white px-3 py-0.5 text-[12px] shadow-sm dark:border-white/10 dark:bg-white/10"
      >
        More Info…
      </ExtLink>

      <div className="flex-1" />
      <p className="text-[10px] leading-snug text-black/40 dark:text-white/40">
        Designed and built by {profile.fullName}.
        <br />
        No real computers were harmed.
      </p>
    </div>
  );
}
