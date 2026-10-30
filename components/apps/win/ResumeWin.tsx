"use client";

import { Download, List, Minus, Plus, Printer } from "lucide-react";
import { useState } from "react";
import { profile } from "@/content/profile";
import { ResumeDocument } from "../resume/ResumeDocument";
import { EdgeToolbar } from "./EdgeWin";

const tool = "grid size-8 place-items-center rounded-md hover:bg-black/5 disabled:opacity-35 dark:hover:bg-white/8";

/** The résumé, open in Edge's PDF viewer. */
export function ResumeWin() {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <EdgeToolbar address={`file:///C:/Users/${profile.name}/Documents/Résumé.pdf`} />
      <div className="flex h-10 shrink-0 items-center gap-1 border-b border-black/8 bg-[#f9f9f9] px-2 text-[12px] dark:border-white/8 dark:bg-[#2b2b2b]">
        <span className={tool} aria-hidden>
          <List className="size-4" strokeWidth={1.75} />
        </span>
        <span className="ml-1 tabular-nums">1 of 1</span>
        <span className="mx-2 h-4 w-px bg-black/15 dark:bg-white/15" />
        <button type="button" aria-label="Zoom out" className={tool} disabled={zoom <= 0.6} onClick={() => setZoom((z) => z - 0.1)}>
          <Minus className="size-4" strokeWidth={1.75} />
        </button>
        <span className="w-10 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
        <button type="button" aria-label="Zoom in" className={tool} disabled={zoom >= 1.6} onClick={() => setZoom((z) => z + 0.1)}>
          <Plus className="size-4" strokeWidth={1.75} />
        </button>
        <div className="flex-1" />
        <a href={profile.resumePdf} download aria-label="Download" className={tool}>
          <Download className="size-4" strokeWidth={1.75} />
        </a>
        <span className={tool} aria-hidden>
          <Printer className="size-4" strokeWidth={1.75} />
        </span>
      </div>
      <div className="os-scroll min-h-0 flex-1 overflow-auto bg-[#e6e6e6] p-6 dark:bg-[#383838]">
        <ResumeDocument zoom={zoom} />
      </div>
    </div>
  );
}
