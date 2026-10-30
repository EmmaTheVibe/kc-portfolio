"use client";

import { ChevronLeft, FlaskConical, ListChecks, Package, Sparkles, Wallet, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { profile } from "@/content/profile";
import { projects, type Project, type ProjectCategory } from "@/content/projects";
import { Avatar, ProjectIcon } from "../shared";
import { GetButton, StoreListing } from "./StoreListing";

type Section = "Discover" | ProjectCategory;

const sections: { id: Section; icon: LucideIcon }[] = [
  { id: "Discover", icon: Sparkles },
  { id: "Productivity", icon: ListChecks },
  { id: "Finance", icon: Wallet },
  { id: "Utilities", icon: Package },
  { id: "Experiments", icon: FlaskConical },
];

export function ProjectRow({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
      className="flex cursor-default items-center gap-3 border-b border-black/10 py-3 last:border-b-0 dark:border-white/10"
    >
      <ProjectIcon project={project} size={56} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold">{project.name}</div>
        <div className="line-clamp-2 text-[12px] leading-4 text-black/50 dark:text-white/50">{project.tagline}</div>
      </div>
      <GetButton project={project} />
    </div>
  );
}

export function FeaturedCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="block w-full overflow-hidden rounded-2xl p-5 text-left text-white"
      style={{ background: `linear-gradient(135deg, ${project.colors[0]}, ${project.colors[1]})` }}
    >
      <span className="text-[11px] font-semibold tracking-wide uppercase opacity-80">Featured project</span>
      <span className="mt-1 block text-[28px] leading-tight font-bold">{project.name}</span>
      <span className="mt-1 block max-w-95 text-[14px] opacity-90">{project.tagline}</span>
    </button>
  );
}

export function StoreDesktop() {
  const [section, setSection] = useState<Section>("Discover");
  const [openId, setOpenId] = useState<string | null>(null);
  const open = projects.find((p) => p.id === openId);
  const list = section === "Discover" ? projects : projects.filter((p) => p.category === section);

  return (
    <div className="flex min-h-0 flex-1">
      <aside className="flex w-50 shrink-0 flex-col border-r border-black/10 p-2 dark:border-white/10 @max-xl:w-16">
        {sections.map(({ id, icon: Icon }) => (
          <button
            key={id}
            type="button"
            title={id}
            onClick={() => {
              setSection(id);
              setOpenId(null);
            }}
            className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[13px] @max-xl:justify-center ${
              id === section && !open ? "bg-black/10 dark:bg-white/15" : "hover:bg-black/5 dark:hover:bg-white/10"
            }`}
          >
            <Icon className="size-4 shrink-0 text-accent" />
            <span className="@max-xl:hidden">{id}</span>
          </button>
        ))}
        <div className="flex-1" />
        <div className="flex items-center gap-2 px-1.5 py-1 @max-xl:justify-center">
          <Avatar initials={profile.initials} colors={["#a78bfa", "#6d28d9"]} size={26} />
          <span className="truncate text-[12px] font-medium @max-xl:hidden">{profile.fullName}</span>
        </div>
      </aside>

      <section className="os-scroll min-w-0 flex-1 overflow-y-auto bg-white px-7 py-5 dark:bg-[#1e1e1e]">
        {open ? (
          <>
            <button
              type="button"
              onClick={() => setOpenId(null)}
              className="mb-4 flex items-center text-[13px] text-accent"
            >
              <ChevronLeft className="size-4" /> {section}
            </button>
            <StoreListing project={open} />
          </>
        ) : (
          <>
            <h1 className="mb-4 text-[26px] font-bold">{section}</h1>
            {section === "Discover" && <FeaturedCard project={projects[0]} onOpen={() => setOpenId(projects[0].id)} />}
            <h2 className="mt-6 mb-1 text-[17px] font-bold">{section === "Discover" ? "All Projects" : `${list.length} Projects`}</h2>
            <div className="grid grid-cols-1 gap-x-8 @2xl:grid-cols-2">
              {list.map((p) => (
                <ProjectRow key={p.id} project={p} onOpen={() => setOpenId(p.id)} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
