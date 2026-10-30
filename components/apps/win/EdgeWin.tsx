"use client";

import { ArrowLeft, ArrowRight, Lock, MoreHorizontal, RotateCw, Search, Star } from "lucide-react";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { favourites, host, openAddress } from "../browser/StartPage";
import { openExternal, ProjectIcon } from "../shared";

const navBtn = "grid size-8 place-items-center rounded-md";

/** The Edge toolbar: back, forward, refresh and a pill-shaped address bar. */
export function EdgeToolbar({ address }: { address: string }) {
  return (
    <div className="flex h-11 shrink-0 items-center gap-1 border-b border-black/8 bg-[#f7f7f7] px-2 dark:border-white/8 dark:bg-[#2b2b2b]">
      <span className={`${navBtn} opacity-35`} aria-hidden>
        <ArrowLeft className="size-4" strokeWidth={1.75} />
      </span>
      <span className={`${navBtn} opacity-35`} aria-hidden>
        <ArrowRight className="size-4" strokeWidth={1.75} />
      </span>
      <span className={`${navBtn} hover:bg-black/5 dark:hover:bg-white/8`} aria-hidden>
        <RotateCw className="size-3.5" strokeWidth={1.75} />
      </span>
      <form
        className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-full bg-[#ebebeb] px-3.5 text-[13px] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#005fb8] dark:bg-[#3a3a3a] dark:focus-within:bg-[#1f1f1f] dark:focus-within:ring-[#60cdff]"
        onSubmit={(e) => {
          e.preventDefault();
          openAddress((e.currentTarget.elements.namedItem("url") as HTMLInputElement).value);
        }}
      >
        <Lock className="size-3.5 shrink-0 opacity-60" />
        <input
          name="url"
          defaultValue={address}
          aria-label="Address"
          onFocus={(e) => e.currentTarget.select()}
          className="min-w-0 flex-1 bg-transparent outline-none"
        />
        <Star className="size-3.5 shrink-0 opacity-60" />
      </form>
      <span className="mx-1 grid size-7 place-items-center rounded-full bg-[#6d28d9] text-[11px] font-semibold text-white">
        {profile.initials}
      </span>
      <span className={navBtn} aria-hidden>
        <MoreHorizontal className="size-4" />
      </span>
    </div>
  );
}

/** Microsoft Edge on its new-tab page: search, quick links and project cards. */
export function EdgeWin() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <EdgeToolbar address={profile.site} />
      <div className="os-scroll min-h-0 flex-1 overflow-y-auto bg-linear-to-b from-[#dbe9fb] to-[#f3f3f3] dark:from-[#1d2a3d] dark:to-[#1f1f1f]">
        <div className="mx-auto w-full max-w-180 px-6 pt-12 pb-10">
          <form
            className="mx-auto flex h-12 max-w-140 items-center gap-3 rounded-full bg-white px-5 shadow-[0_2px_10px_rgba(0,0,0,.12)] dark:bg-[#2b2b2b]"
            onSubmit={(e) => {
              e.preventDefault();
              const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value.trim();
              if (!q) return;
              if (q.includes(".") && !q.includes(" ")) openAddress(q);
              else openExternal(`https://www.bing.com/search?q=${encodeURIComponent(q)}`);
            }}
          >
            <Search className="size-4.5 shrink-0 opacity-60" />
            <input
              name="q"
              aria-label="Search the web"
              placeholder="Search the web"
              className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-black/50 dark:placeholder:text-white/50"
            />
          </form>

          <div className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(92px,1fr))] gap-3">
            {favourites.map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.label}
                  type="button"
                  onClick={() => openExternal(f.href)}
                  className="flex flex-col items-center gap-2 rounded-md bg-white/70 px-2 py-3 transition-colors hover:bg-white dark:bg-white/6 dark:hover:bg-white/10"
                >
                  <span className="grid size-10 place-items-center rounded-full text-[14px] font-bold text-white" style={{ background: f.color }}>
                    {Icon ? <Icon className="size-5" /> : f.letter}
                  </span>
                  <span className="w-full truncate text-center text-[12px]">{f.label}</span>
                </button>
              );
            })}
            {projects.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => openExternal(p.url)}
                className="flex flex-col items-center gap-2 rounded-md bg-white/70 px-2 py-3 transition-colors hover:bg-white dark:bg-white/6 dark:hover:bg-white/10"
              >
                <ProjectIcon project={p} size={40} />
                <span className="w-full truncate text-center text-[12px]">{p.name}</span>
              </button>
            ))}
          </div>

          <h2 className="mt-10 mb-3 text-[15px] font-semibold">Live demos</h2>
          <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2">
            {projects.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => openExternal(p.url)}
                className="overflow-hidden rounded-lg bg-white text-left shadow-[0_1px_4px_rgba(0,0,0,.1)] transition-shadow hover:shadow-[0_4px_14px_rgba(0,0,0,.15)] dark:bg-[#2b2b2b]"
              >
                <span className="block aspect-[16/7]" style={{ background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]})` }} />
                <span className="block px-4 py-3">
                  <span className="block truncate text-[14px] font-semibold">{p.name}</span>
                  <span className="mt-0.5 line-clamp-2 text-[12px] text-black/60 dark:text-white/60">{p.tagline}</span>
                  <span className="mt-2 block truncate text-[11px] text-black/45 dark:text-white/45">{host(p.url)}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
