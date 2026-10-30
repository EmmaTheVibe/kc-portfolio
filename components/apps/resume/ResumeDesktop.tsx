"use client";

import { Download, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";
import { profile } from "@/content/profile";
import { ResumeDocument } from "./ResumeDocument";

const toolBtn =
  "grid size-7 place-items-center rounded-md text-black/60 hover:bg-black/5 disabled:opacity-30 dark:text-white/60 dark:hover:bg-white/10";

export function ResumeDesktop() {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex h-10 shrink-0 items-center gap-1 border-b border-black/10 px-3 dark:border-white/10">
        <span className="text-[12px] text-black/45 dark:text-white/45">Page 1 of 1</span>
        <div className="flex-1" />
        <button type="button" aria-label="Zoom out" className={toolBtn} disabled={zoom <= 0.6} onClick={() => setZoom((z) => z - 0.1)}>
          <ZoomOut className="size-4" />
        </button>
        <span className="w-10 text-center text-[11px] tabular-nums text-black/50 dark:text-white/50">{Math.round(zoom * 100)}%</span>
        <button type="button" aria-label="Zoom in" className={toolBtn} disabled={zoom >= 1.6} onClick={() => setZoom((z) => z + 0.1)}>
          <ZoomIn className="size-4" />
        </button>
        <a
          href={profile.resumePdf}
          download
          className="ml-2 flex h-7 items-center gap-1.5 rounded-md bg-accent px-2.5 text-[12px] font-medium !text-white"
        >
          <Download className="size-3.5" /> Download
        </a>
      </div>
      <div className="os-scroll min-h-0 flex-1 overflow-auto bg-[#e5e5e7] p-6 dark:bg-[#1c1c1e]">
        <ResumeDocument zoom={zoom} />
      </div>
    </div>
  );
}
