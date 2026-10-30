"use client";

import { ArrowLeft, FlaskConical, Home, ListChecks, Package, Search, Star, Wallet, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { profile } from "@/content/profile";
import { projects, type Project, type ProjectCategory } from "@/content/projects";
import { ExtLink, openExternal, ProjectIcon } from "../shared";

type Section = "Home" | ProjectCategory;

const sections: { id: Section; icon: LucideIcon }[] = [
  { id: "Home", icon: Home },
  { id: "Productivity", icon: ListChecks },
  { id: "Finance", icon: Wallet },
  { id: "Utilities", icon: Package },
  { id: "Experiments", icon: FlaskConical },
];

const getBtn =
  "rounded-md bg-[#005fb8] px-5 py-1.5 text-[13px] font-semibold text-white hover:bg-[#005fb8]/90 dark:bg-[#60cdff] dark:text-black dark:hover:bg-[#60cdff]/90";

function Rating() {
  return (
    <span className="flex items-center gap-1 text-[12px] text-black/60 dark:text-white/60">
      5.0 <Star className="size-3 fill-current" />
    </span>
  );
}

function AppCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex flex-col rounded-lg border border-black/6 bg-white p-4 text-left shadow-[0_1px_3px_rgba(0,0,0,.06)] transition-shadow hover:shadow-[0_4px_14px_rgba(0,0,0,.12)] dark:border-white/6 dark:bg-[#2b2b2b]"
    >
      <ProjectIcon project={project} size={56} />
      <span className="mt-3 truncate text-[14px] font-semibold">{project.name}</span>
      <span className="truncate text-[12px] text-black/55 dark:text-white/55">{project.category}</span>
      <span className="mt-2 flex items-center justify-between">
        <Rating />
        <span className="text-[12px] font-semibold">Free</span>
      </span>
    </button>
  );
}

function Listing({ project, onBack }: { project: Project; onBack: () => void }) {
  return (
    <div className="select-text">
      <button type="button" onClick={onBack} className="mb-4 grid size-8 place-items-center rounded-md hover:bg-black/5 dark:hover:bg-white/8" aria-label="Back">
        <ArrowLeft className="size-4" />
      </button>
      <div className="flex flex-col gap-6 @2xl:flex-row">
        <aside className="shrink-0 rounded-lg border border-black/6 bg-white p-6 @2xl:w-72 dark:border-white/6 dark:bg-[#2b2b2b]">
          <ProjectIcon project={project} size={96} />
          <h1 className="mt-4 text-[24px] leading-tight font-semibold">{project.name}</h1>
          <p className="text-[13px] text-[#005fb8] dark:text-[#60cdff]">{profile.fullName}</p>
          <div className="mt-2">
            <Rating />
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button type="button" onClick={() => openExternal(project.url)} className={getBtn}>
              Get
            </button>
            <ExtLink href={project.repo} className="text-[13px] text-[#005fb8] dark:text-[#60cdff]">
              Source code
            </ExtLink>
          </div>
          <p className="mt-5 text-[12px] text-black/55 dark:text-white/55">
            {project.category} · {project.year} · Version {project.version}
          </p>
        </aside>
        <div className="min-w-0 flex-1">
          <h2 className="mb-2 text-[16px] font-semibold">Screenshots</h2>
          <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="aspect-[16/10] w-60 shrink-0 rounded-md"
                style={{ background: `linear-gradient(${140 + i * 40}deg, ${project.colors[0]}, ${project.colors[1]})` }}
              />
            ))}
          </div>
          <h2 className="mt-6 mb-2 text-[16px] font-semibold">Description</h2>
          <div className="space-y-2 text-[13px] leading-relaxed">
            {project.description.map((d) => (
              <p key={d}>{d}</p>
            ))}
          </div>
          <h2 className="mt-6 mb-1 text-[16px] font-semibold">What&apos;s new in this version</h2>
          <p className="text-[13px] leading-relaxed">{project.whatsNew}</p>
          <h2 className="mt-6 mb-2 text-[16px] font-semibold">Built with</h2>
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <span key={s} className="rounded-full border border-black/10 px-2.5 py-0.5 text-[12px] dark:border-white/12">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Microsoft Store: nav rail, hero banner, app cards and listing pages. */
export function StoreWin() {
  const [section, setSection] = useState<Section>("Home");
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const open = projects.find((p) => p.id === openId);
  const q = query.trim().toLowerCase();
  const list = projects.filter(
    (p) => (section === "Home" || p.category === section) && (!q || `${p.name} ${p.tagline}`.toLowerCase().includes(q)),
  );
  const hero = projects[0];

  return (
    <div className="flex min-h-0 flex-1 bg-[#f3f3f3] dark:bg-[#202020]">
      <nav className="flex w-18 shrink-0 flex-col items-center gap-1 pt-2">
        {sections.map(({ id, icon: Icon }) => {
          const active = id === section && !open;
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                setSection(id);
                setOpenId(null);
              }}
              className={`relative flex w-16 flex-col items-center gap-1 rounded-md py-2 text-[10px] hover:bg-black/4 dark:hover:bg-white/5 ${
                active ? "bg-white/80 font-semibold dark:bg-white/6" : "text-black/65 dark:text-white/65"
              }`}
            >
              {active && <span className="absolute top-3 bottom-3 left-0 w-0.75 rounded-full bg-[#005fb8] dark:bg-[#60cdff]" />}
              <Icon className="size-4.5" strokeWidth={active ? 2.1 : 1.6} />
              <span className="w-full truncate px-1">{id}</span>
            </button>
          );
        })}
      </nav>

      <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-tl-lg border-t border-l border-black/6 bg-[#f9f9f9] dark:border-white/6 dark:bg-[#272727]">
        <div className="flex shrink-0 justify-center px-6 pt-3 pb-2">
          <label className="flex h-8 w-full max-w-110 items-center gap-2 rounded-md border border-black/8 border-b-black/30 bg-white px-3 text-[13px] focus-within:border-b-2 focus-within:border-b-[#005fb8] dark:border-white/8 dark:border-b-white/40 dark:bg-white/5 dark:focus-within:border-b-[#60cdff]">
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpenId(null);
              }}
              placeholder="Search apps"
              aria-label="Search apps"
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-black/50 dark:placeholder:text-white/50"
            />
            <Search className="size-3.5 shrink-0 opacity-60" />
          </label>
        </div>

        <div className="os-scroll min-h-0 flex-1 overflow-y-auto px-6 pt-2 pb-6">
          {open ? (
            <Listing project={open} onBack={() => setOpenId(null)} />
          ) : (
            <>
              {section === "Home" && !q && (
                <button
                  type="button"
                  onClick={() => setOpenId(hero.id)}
                  className="relative mb-6 block w-full overflow-hidden rounded-lg p-8 text-left text-white"
                  style={{ background: `linear-gradient(120deg, ${hero.colors[0]}, ${hero.colors[1]})` }}
                >
                  <span className="text-[12px] font-semibold tracking-wide uppercase opacity-85">Featured</span>
                  <span className="mt-1 block text-[32px] leading-tight font-semibold">{hero.name}</span>
                  <span className="mt-1 block max-w-90 text-[14px] opacity-90">{hero.tagline}</span>
                  <span className="mt-4 inline-block rounded-md bg-white/90 px-5 py-1.5 text-[13px] font-semibold text-black">See details</span>
                </button>
              )}
              <h2 className="mb-3 text-[18px] font-semibold">{q ? `Results for “${query.trim()}”` : section === "Home" ? "Apps by Mark" : section}</h2>
              {list.length === 0 ? (
                <p className="text-[13px] text-black/55 dark:text-white/55">Nothing here yet.</p>
              ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-3">
                  {list.map((p) => (
                    <AppCard key={p.id} project={p} onOpen={() => setOpenId(p.id)} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
