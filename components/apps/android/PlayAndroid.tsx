"use client";

import { ArrowRight, Mic, Search, Star } from "lucide-react";
import { useState } from "react";
import { profile } from "@/content/profile";
import { projects, type Project } from "@/content/projects";
import { AScreen, AStack, SearchBar } from "../../android/Material";
import { Avatar, ExtLink, openExternal, ProjectIcon } from "../shared";

const TABS = ["For you", ...new Set(projects.map((p) => p.category))];
const install = "rounded-full bg-[#01875f] font-medium text-white dark:bg-[#7fd8a7] dark:text-[#00391f]";

function Rating() {
  return (
    <span className="inline-flex items-center gap-0.5">
      5.0 <Star className="size-3 fill-current" />
    </span>
  );
}

function AppRow({ project, rank, onOpen }: { project: Project; rank: number; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="flex w-full items-center gap-4 px-4 py-2.5 text-left active:bg-(--md-on-surface)/10">
      <span className="w-4 shrink-0 text-center text-[14px] text-(--md-on-surface-variant)">{rank}</span>
      <ProjectIcon project={project} size={56} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[16px]">{project.name}</span>
        <span className="block truncate text-[14px] text-(--md-on-surface-variant)">
          {project.category} • {project.year}
        </span>
        <span className="block text-[12px] text-(--md-on-surface-variant)">
          <Rating />
        </span>
      </span>
    </button>
  );
}

/** Fake screenshot: a phone-shaped gradient with a few UI-ish blocks. */
function Screenshot({ project, i }: { project: Project; i: number }) {
  return (
    <div
      className="relative aspect-[9/16] w-32 shrink-0 overflow-hidden rounded-2xl"
      style={{ background: `linear-gradient(${150 + i * 40}deg, ${project.colors[0]}, ${project.colors[1]})` }}
    >
      <div className="absolute inset-x-3 top-3 h-3 rounded-full bg-white/40" />
      <div className="absolute inset-x-3 top-9 h-20 rounded-xl bg-white/30" />
      <div className="absolute inset-x-3 bottom-3 h-9 rounded-xl bg-white/25" />
    </div>
  );
}

function Listing({ project, onBack }: { project: Project; onBack: () => void }) {
  const facts = [
    { top: <Rating />, label: "Rating" },
    { top: project.year, label: "Released" },
    { top: project.stack.length, label: "Tools used" },
    { top: project.category, label: "Category" },
  ];

  return (
    <AScreen onBack={onBack}>
      <div className="select-text px-5">
        <header className="flex items-center gap-5">
          <ProjectIcon project={project} size={72} />
          <div className="min-w-0">
            <h1 className="text-[24px] leading-8">{project.name}</h1>
            <p className="text-[14px] font-medium text-[#01875f] dark:text-[#7fd8a7]">{profile.fullName}</p>
            <p className="text-[12px] text-(--md-on-surface-variant)">{project.role}</p>
          </div>
        </header>

        <div className="no-scrollbar -mx-5 mt-5 flex overflow-x-auto px-3">
          {facts.map((f) => (
            <div key={f.label} className="min-w-24 flex-1 border-r border-(--md-outline-variant) px-2 text-center last:border-r-0">
              <div className="truncate text-[14px] font-medium">{f.top}</div>
              <div className="truncate text-[12px] text-(--md-on-surface-variant)">{f.label}</div>
            </div>
          ))}
        </div>

        <button type="button" onClick={() => openExternal(project.url)} className={`mt-5 h-10 w-full text-[14px] ${install}`}>
          Install
        </button>

        <div className="no-scrollbar -mx-5 mt-6 flex gap-2 overflow-x-auto px-5">
          {[0, 1, 2].map((i) => (
            <Screenshot key={i} project={project} i={i} />
          ))}
        </div>

        <h2 className="mt-6 flex items-center justify-between text-[18px]">
          About this app <ArrowRight className="size-5" />
        </h2>
        <div className="mt-2 space-y-2 text-[14px] leading-5 text-(--md-on-surface-variant)">
          {project.description.map((d) => (
            <p key={d}>{d}</p>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span key={s} className="rounded-lg border border-(--md-outline-variant) px-3 py-1.5 text-[14px] text-(--md-on-surface-variant)">
              {s}
            </span>
          ))}
        </div>

        <h2 className="mt-6 text-[18px]">What&apos;s new</h2>
        <p className="text-[12px] text-(--md-on-surface-variant)">Version {project.version}</p>
        <p className="mt-1 text-[14px] leading-5 text-(--md-on-surface-variant)">{project.whatsNew}</p>

        <ExtLink href={project.repo} className="mt-6 inline-block text-[14px] font-medium text-[#01875f] dark:text-[#7fd8a7]">
          View source code ↗
        </ExtLink>
      </div>
    </AScreen>
  );
}

type Route = { name: "home" } | { name: "app"; id: string };

/** Google Play: search, category tabs, a featured banner and a ranked list; each project gets a listing. */
export function PlayAndroid() {
  const [tab, setTab] = useState<string>(TABS[0]);
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const list = projects.filter(
    (p) => (tab === TABS[0] || p.category === tab) && (!q || `${p.name} ${p.tagline}`.toLowerCase().includes(q)),
  );
  const featured = projects[0];

  return (
    <AStack<Route>
      root={{ name: "home" }}
      render={(route, nav) => {
        const project = route.name === "app" ? projects.find((p) => p.id === route.id) : undefined;
        if (project) return <Listing project={project} onBack={nav.pop} />;
        const open = (id: string) => nav.push({ name: "app", id });
        return (
          <AScreen
            header={
              <>
                <SearchBar
                  value={query}
                  onChange={setQuery}
                  placeholder="Search apps & games"
                  leading={<Search className="size-6" />}
                  trailing={
                    <>
                      <Mic aria-hidden className="mx-2 size-6 shrink-0" />
                      <Avatar initials={profile.initials} colors={["#a78bfa", "#6d28d9"]} size={32} />
                    </>
                  }
                />
                <div role="tablist" className="no-scrollbar flex overflow-x-auto border-b border-(--md-outline-variant) px-2">
                  {TABS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      role="tab"
                      aria-selected={t === tab}
                      onClick={() => setTab(t)}
                      className={`relative shrink-0 px-4 py-3 text-[14px] font-medium ${t === tab ? "text-[#01875f] dark:text-[#7fd8a7]" : "text-(--md-on-surface-variant)"}`}
                    >
                      {t}
                      {t === tab && <span className="absolute inset-x-4 bottom-0 h-[3px] rounded-t-full bg-current" />}
                    </button>
                  ))}
                </div>
              </>
            }
          >
            {tab === TABS[0] && !q && (
              <button type="button" onClick={() => open(featured.id)} className="mx-4 mt-4 block overflow-hidden rounded-3xl text-left text-white" style={{ background: `linear-gradient(135deg, ${featured.colors[0]}, ${featured.colors[1]})` }}>
                <span className="block px-5 pt-5 text-[12px] font-medium tracking-wide uppercase opacity-85">Featured project</span>
                <span className="block px-5 pt-1 text-[26px] leading-8 font-medium">{featured.name}</span>
                <span className="block px-5 pt-1 text-[14px] opacity-90">{featured.tagline}</span>
                <span className="mt-5 flex items-center gap-3 bg-black/20 px-5 py-3">
                  <ProjectIcon project={featured} size={40} />
                  <span className="min-w-0 flex-1 truncate text-[14px]">
                    {featured.name} • <Rating />
                  </span>
                  <span className={`px-4 py-1.5 text-[14px] ${install}`}>Install</span>
                </span>
              </button>
            )}
            <h2 className="px-4 pt-5 pb-1 text-[18px]">{q ? "Results" : tab === TABS[0] ? "Top projects" : tab}</h2>
            {list.length === 0 && <p className="px-4 pt-2 text-[14px] text-(--md-on-surface-variant)">No results for “{query.trim()}”</p>}
            {list.map((p, i) => (
              <AppRow key={p.id} project={p} rank={i + 1} onOpen={() => open(p.id)} />
            ))}
          </AScreen>
        );
      }}
    />
  );
}
