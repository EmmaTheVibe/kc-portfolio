import { profile } from "@/content/profile";
import { resume } from "@/content/resume";

export const PAGE_WIDTH = 612;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="mb-2 border-b border-black/15 pb-1 text-[10px] font-semibold tracking-[0.12em] text-black/55 uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** A US-letter-width "PDF" page. Always light, like real paper. */
export function ResumeDocument({ zoom = 1 }: { zoom?: number }) {
  return (
    <div
      className="mx-auto min-h-[792px] bg-white px-12 py-11 text-[11px] leading-[1.5] text-black shadow-[0_2px_12px_rgba(0,0,0,.18)] select-text"
      style={{ width: PAGE_WIDTH, zoom }}
    >
      <header>
        <h1 className="text-[24px] leading-tight font-bold">{profile.fullName}</h1>
        <p className="text-[13px] text-black/70">{profile.role}</p>
        <p className="mt-1 text-black/55">
          {profile.email} · {profile.site} · {profile.location}
        </p>
      </header>

      <Section title="Summary">
        <p>{resume.summary}</p>
      </Section>

      <Section title="Experience">
        {resume.experience.map((job) => (
          <div key={job.company} className="mb-3">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-semibold">
                {job.role} · {job.company}
              </span>
              <span className="shrink-0 text-black/55">{job.period}</span>
            </div>
            <p className="text-black/55">{job.location}</p>
            <ul className="mt-1 list-disc pl-4">
              {job.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      <Section title="Education">
        {resume.education.map((e) => (
          <div key={e.school} className="flex items-baseline justify-between">
            <span>
              <span className="font-semibold">{e.degree}</span> · {e.school}
            </span>
            <span className="text-black/55">{e.period}</span>
          </div>
        ))}
      </Section>

      <Section title="Skills">
        {resume.skills.map((s) => (
          <p key={s.group}>
            <span className="font-semibold">{s.group}:</span> {s.items.join(", ")}
          </p>
        ))}
      </Section>
    </div>
  );
}
