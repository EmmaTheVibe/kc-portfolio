import type { AppId, PhoneAppId } from "@/lib/apps";
import { AboutWindow } from "./AboutWindow";
import { AssistantDesktop } from "./assistant/AssistantDesktop";
import { AssistantPhone } from "./assistant/AssistantPhone";
import { BrowserDesktop } from "./browser/BrowserDesktop";
import { BrowserPhone } from "./browser/BrowserPhone";
import { MessagesDesktop } from "./messages/MessagesDesktop";
import { MessagesPhone } from "./messages/MessagesPhone";
import { NotesDesktop } from "./notes/NotesDesktop";
import { NotesPhone } from "./notes/NotesPhone";
import { PhotosDesktop } from "./photos/PhotosDesktop";
import { PhotosPhone } from "./photos/PhotosPhone";
import { ResumeDesktop } from "./resume/ResumeDesktop";
import { ResumePhone } from "./resume/ResumePhone";
import { SettingsDesktop } from "./settings/SettingsDesktop";
import { SettingsPhone } from "./settings/SettingsPhone";
import { StoreDesktop } from "./store/StoreDesktop";
import { StorePhone } from "./store/StorePhone";

export function renderDesktopView(id: AppId) {
  switch (id) {
    case "notes":
      return <NotesDesktop />;
    case "messages":
      return <MessagesDesktop />;
    case "browser":
      return <BrowserDesktop />;
    case "store":
      return <StoreDesktop />;
    case "photos":
      return <PhotosDesktop />;
    case "resume":
      return <ResumeDesktop />;
    case "assistant":
      return <AssistantDesktop />;
    case "settings":
      return <SettingsDesktop />;
    case "about":
      return <AboutWindow />;
  }
}

export function renderPhoneView(id: PhoneAppId) {
  switch (id) {
    case "notes":
      return <NotesPhone />;
    case "messages":
      return <MessagesPhone />;
    case "browser":
      return <BrowserPhone />;
    case "store":
      return <StorePhone />;
    case "photos":
      return <PhotosPhone />;
    case "resume":
      return <ResumePhone />;
    case "assistant":
      return <AssistantPhone />;
    case "settings":
      return <SettingsPhone />;
  }
}
