import type { PhoneAppId } from "@/lib/apps";
import { AssistantAndroid } from "./AssistantAndroid";
import { ChromeAndroid } from "./ChromeAndroid";
import { KeepAndroid } from "./KeepAndroid";
import { MessagesAndroid } from "./MessagesAndroid";
import { PhotosAndroid } from "./PhotosAndroid";
import { PlayAndroid } from "./PlayAndroid";
import { ResumeAndroid } from "./ResumeAndroid";
import { SettingsAndroid } from "./SettingsAndroid";

/** Android's own apps. None of the iPhone's views run here. */
export function renderAndroidView(id: PhoneAppId) {
  switch (id) {
    case "notes":
      return <KeepAndroid />;
    case "messages":
      return <MessagesAndroid />;
    case "browser":
      return <ChromeAndroid />;
    case "store":
      return <PlayAndroid />;
    case "photos":
      return <PhotosAndroid />;
    case "resume":
      return <ResumeAndroid />;
    case "assistant":
      return <AssistantAndroid />;
    case "settings":
      return <SettingsAndroid />;
  }
}
