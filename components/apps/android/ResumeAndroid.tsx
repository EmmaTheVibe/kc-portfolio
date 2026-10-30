"use client";

import { Download, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { profile } from "@/content/profile";
import { AScreen } from "../../android/Material";
import { PAGE_WIDTH, ResumeDocument } from "../resume/ResumeDocument";

const fitZoom = () => (window.innerWidth - 24) / PAGE_WIDTH;

/** The résumé in Drive's PDF viewer: grey canvas, page fitted to the width, page count chip. */
export function ResumeAndroid() {
  const [zoom, setZoom] = useState(fitZoom);

  useEffect(() => {
    const onResize = () => setZoom(fitZoom());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <AScreen
      title="Résumé.pdf"
      bg="bg-(--md-surface-container)"
      actions={
        <>
          <span aria-hidden className="grid size-12 place-items-center">
            <Search className="size-6" />
          </span>
          <a href={profile.resumePdf} download aria-label="Download résumé" className="grid size-12 place-items-center rounded-full active:bg-(--md-on-surface)/10">
            <Download className="size-6" />
          </a>
        </>
      }
    >
      <div className="relative px-3 pt-2">
        <span className="absolute top-4 right-5 z-10 rounded-full bg-(--md-on-surface)/70 px-2.5 py-0.5 text-[12px] text-(--md-surface)">1 / 1</span>
        <ResumeDocument zoom={zoom} />
      </div>
    </AScreen>
  );
}
