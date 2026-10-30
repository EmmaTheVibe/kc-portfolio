import type { AppId } from "@/lib/apps";
import { AboutWindow } from "../AboutWindow";
import { AssistantDesktop } from "../assistant/AssistantDesktop";
import { EdgeWin } from "./EdgeWin";
import { PhotosWin } from "./PhotosWin";
import { ResumeWin } from "./ResumeWin";
import { SettingsWin } from "./SettingsWin";
import { StickyNotesWin } from "./stickies/StickyNotesWin";
import { StoreWin } from "./StoreWin";
import { TeamsWin } from "./TeamsWin";

/** Windows' own apps. The Assistant is a third-party app, so it looks the same on every platform. */
export function renderWindowsView(id: AppId) {
  switch (id) {
    case "notes":
      return <StickyNotesWin />;
    case "messages":
      return <TeamsWin />;
    case "browser":
      return <EdgeWin />;
    case "store":
      return <StoreWin />;
    case "photos":
      return <PhotosWin />;
    case "resume":
      return <ResumeWin />;
    case "assistant":
      return <AssistantDesktop />;
    case "settings":
      return <SettingsWin />;
    case "about":
      return <AboutWindow />;
  }
}
