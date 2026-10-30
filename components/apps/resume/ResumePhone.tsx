"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { profile } from "@/content/profile";
import { NavScreen } from "../../phone/NavStack";
import { PAGE_WIDTH, ResumeDocument } from "./ResumeDocument";

const fitZoom = () => (window.innerWidth - 24) / PAGE_WIDTH;

export function ResumePhone() {
  const [zoom, setZoom] = useState(fitZoom);

  useEffect(() => {
    const onResize = () => setZoom(fitZoom());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <NavScreen
      title="Résumé"
      bgClass="bg-[#e5e5e7] dark:bg-[#1c1c1e]"
      trailing={
        <a href={profile.resumePdf} download aria-label="Download résumé" className="p-1">
          <Download className="size-5" />
        </a>
      }
    >
      <div className="px-3 pt-2">
        <ResumeDocument zoom={zoom} />
      </div>
    </NavScreen>
  );
}
