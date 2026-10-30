"use client";

import { Star } from "lucide-react";
import type { Project } from "@/content/projects";
import { ExtLink, openExternal, ProjectIcon } from "../shared";

export function GetButton({ project, filled }: { project: Project; filled?: boolean }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        openExternal(project.url);
      }}
      className={`shrink-0 rounded-full px-4 py-1 text-[13px] font-bold ${
        filled ? "bg-accent text-white" : "bg-black/5 text-accent dark:bg-white/10"
      }`}
    >
      Get
    </button>
  );
}

/** Fake "screenshot": a gradient with a few UI-ish blocks. */
function Screenshot({ project, i }: { project: Project; i: number }) {
  return (
    <div
      className="relative aspect-[10/16] w-[150px] shrink-0 overflow-hidden rounded-xl @md:aspect-[16/10] @md:w-[260px]"
      style={{ background: `linear-gradient(${140 + i * 40}deg, ${project.colors[0]}, ${project.colors[1]})` }}
    >
      <div className="absolute inset-x-3 top-3 h-3 rounded-full bg-white/40" />
      <div className="absolute left-3 top-9 h-16 w-[45%] rounded-lg bg-white/30" />
      <div className="absolute right-3 top-9 h-16 w-[38%] rounded-lg bg-white/20" />
      <div className="absolute inset-x-3 bottom-3 h-8 rounded-lg bg-white/25" />
    </div>
  );
}

/** Store product page for a project. Lays itself out with container queries. */
export function StoreListing({ project }: { project: Project }) {
  const facts = [
    { label: "Rating", value: "5.0", extra: <Stars /> },
    { label: "Year", value: String(project.year) },
    { label: "Category", value: project.category },
    { label: "Built with", value: `${project.stack.length} tools` },
  ];

  return (
    <div className="select-text">
      <header className="flex items-center gap-4">
        <ProjectIcon project={project} size={104} />
        <div className="min-w-0">
          <h1 className="text-[24px] leading-tight font-bold">{project.name}</h1>
          <p className="mb-3 text-[13px] text-black/50 dark:text-white/50">{project.tagline}</p>
          <div className="flex items-center gap-3">
            <GetButton project={project} filled />
            <ExtLink href={project.repo} className="text-[13px] text-accent">
              Source ↗
            </ExtLink>
          </div>
        </div>
      </header>

      <div className="no-scrollbar mt-5 flex overflow-x-auto border-y border-black/10 py-3 dark:border-white/10">
        {facts.map((f) => (
          <div key={f.label} className="min-w-[96px] flex-1 border-r border-black/10 px-2 text-center last:border-r-0 dark:border-white/10">
            <div className="text-[10px] font-semibold tracking-wide text-black/40 uppercase dark:text-white/40">{f.label}</div>
            <div className="text-[17px] font-bold text-black/60 dark:text-white/60">{f.value}</div>
            {f.extra}
          </div>
        ))}
      </div>

      <div className="no-scrollbar -mx-1 mt-5 flex gap-3 overflow-x-auto px-1 pb-1">
        {[0, 1, 2].map((i) => (
          <Screenshot key={i} project={project} i={i} />
        ))}
      </div>

      <div className="mt-5 space-y-2 text-[13px] leading-relaxed">
        {project.description.map((d) => (
          <p key={d}>{d}</p>
        ))}
      </div>

      <h2 className="mt-6 text-[17px] font-bold">What&apos;s New</h2>
      <p className="text-[12px] text-black/45 dark:text-white/45">Version {project.version}</p>
      <p className="mt-1 text-[13px] leading-relaxed">{project.whatsNew}</p>

      <h2 className="mt-6 mb-2 text-[17px] font-bold">Built With</h2>
      <div className="flex flex-wrap gap-1.5">
        {project.stack.map((s) => (
          <span key={s} className="rounded-full bg-black/5 px-2.5 py-0.5 text-[12px] dark:bg-white/10">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function Stars() {
  return (
    <div className="mt-0.5 flex justify-center gap-px text-black/50 dark:text-white/50">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className="size-2.5 fill-current" />
      ))}
    </div>
  );
}
