import type { Geom, Size } from "./geometry";
import type { DesktopSkin } from "./platform";

export type AppId =
  | "notes"
  | "messages"
  | "browser"
  | "store"
  | "photos"
  | "resume"
  | "assistant"
  | "settings"
  | "about";

/** Decorative icons look real but do nothing when clicked. */
export type DecoIconId = "files" | "mail";
export type IconId = Exclude<AppId, "about"> | DecoIconId;

export type WindowConfig = {
  geom: Geom;
  min: Size;
  resizable: boolean;
  maximizable: boolean;
  openByDefault: boolean;
};

export type AppDef = {
  id: AppId;
  /** Shown in the window titlebar. */
  title: string;
  /** Shown in the menu bar while the window is frontmost. */
  menuName: string;
  window: WindowConfig;
};

export const apps: Record<AppId, AppDef> = {
  notes: {
    id: "notes",
    title: "Notes",
    menuName: "Notes",
    window: {
      geom: { x: 110, y: 56, w: 760, h: 500 },
      min: { w: 560, h: 380 },
      resizable: true,
      maximizable: true,
      openByDefault: true,
    },
  },
  messages: {
    id: "messages",
    title: "Messages",
    menuName: "Messages",
    window: {
      geom: { x: 190, y: 96, w: 720, h: 480 },
      min: { w: 540, h: 360 },
      resizable: true,
      maximizable: true,
      openByDefault: false,
    },
  },
  browser: {
    id: "browser",
    title: "Browser",
    menuName: "Browser",
    window: {
      geom: { x: 150, y: 60, w: 900, h: 580 },
      min: { w: 520, h: 380 },
      resizable: true,
      maximizable: true,
      openByDefault: false,
    },
  },
  store: {
    id: "store",
    title: "Store",
    menuName: "Store",
    window: {
      geom: { x: 210, y: 70, w: 880, h: 580 },
      min: { w: 600, h: 400 },
      resizable: true,
      maximizable: true,
      openByDefault: false,
    },
  },
  photos: {
    id: "photos",
    title: "Photos",
    menuName: "Photos",
    window: {
      geom: { x: 230, y: 64, w: 800, h: 540 },
      min: { w: 560, h: 380 },
      resizable: true,
      maximizable: true,
      openByDefault: false,
    },
  },
  resume: {
    id: "resume",
    title: "Résumé.pdf",
    menuName: "Preview",
    window: {
      geom: { x: 320, y: 36, w: 680, h: 640 },
      min: { w: 420, h: 360 },
      resizable: true,
      maximizable: true,
      openByDefault: false,
    },
  },
  assistant: {
    id: "assistant",
    title: "Assistant",
    menuName: "Assistant",
    window: {
      geom: { x: 170, y: 48, w: 880, h: 560 },
      min: { w: 660, h: 420 },
      resizable: true,
      maximizable: true,
      openByDefault: false,
    },
  },
  settings: {
    id: "settings",
    title: "Settings",
    menuName: "Settings",
    window: {
      geom: { x: 260, y: 80, w: 600, h: 520 },
      min: { w: 420, h: 360 },
      resizable: true,
      maximizable: true,
      openByDefault: false,
    },
  },
  about: {
    id: "about",
    title: "",
    menuName: "About This Site",
    window: {
      geom: { x: 560, y: 110, w: 300, h: 470 },
      min: { w: 300, h: 470 },
      resizable: false,
      maximizable: false,
      openByDefault: false,
    },
  },
};

export const appIds = Object.keys(apps) as AppId[];

/** Windows runs its own apps (Sticky Notes, Teams, Edge…): different names and window sizes. */
const windowsApps: Partial<Record<AppId, { title: string; window?: Partial<WindowConfig> }>> = {
  notes: {
    title: "Sticky Notes",
    window: { geom: { x: 24, y: 24, w: 320, h: 500 }, min: { w: 280, h: 360 }, maximizable: false },
  },
  messages: { title: "Microsoft Teams", window: { geom: { x: 160, y: 60, w: 880, h: 560 }, min: { w: 560, h: 380 } } },
  browser: { title: "Microsoft Edge" },
  store: { title: "Microsoft Store", window: { geom: { x: 200, y: 50, w: 940, h: 600 } } },
  photos: { title: "Photos" },
  resume: { title: "Résumé.pdf" },
  settings: { title: "Settings", window: { geom: { x: 240, y: 60, w: 760, h: 540 }, min: { w: 520, h: 380 } } },
};

export const appTitle = (id: AppId, skin: DesktopSkin) =>
  skin === "windows" ? (windowsApps[id]?.title ?? apps[id].title) : apps[id].title;

export const windowConfig = (id: AppId, skin: DesktopSkin): WindowConfig =>
  skin === "windows" ? { ...apps[id].window, ...windowsApps[id]?.window } : apps[id].window;

export const iconLabels: Record<IconId, string> = {
  notes: "Notes",
  messages: "Messages",
  browser: "Browser",
  store: "Store",
  photos: "Photos",
  resume: "Résumé",
  assistant: "Assistant",
  files: "Files",
  mail: "Mail",
  settings: "Settings",
};

export const winLabels: Record<IconId, string> = {
  notes: "Sticky Notes",
  messages: "Microsoft Teams",
  browser: "Microsoft Edge",
  store: "Microsoft Store",
  photos: "Photos",
  resume: "Résumé.pdf",
  assistant: "Assistant",
  files: "File Explorer",
  mail: "Outlook",
  settings: "Settings",
};

export type DockItem =
  | { kind: "app"; id: Exclude<AppId, "about"> }
  | { kind: "deco"; icon: DecoIconId }
  | { kind: "divider" };

export const desktopDock: DockItem[] = [
  { kind: "deco", icon: "files" },
  { kind: "app", id: "browser" },
  { kind: "deco", icon: "mail" },
  { kind: "app", id: "notes" },
  { kind: "app", id: "messages" },
  { kind: "app", id: "photos" },
  { kind: "app", id: "store" },
  { kind: "app", id: "resume" },
  { kind: "app", id: "assistant" },
  { kind: "divider" },
  { kind: "app", id: "settings" },
];

/** Pinned to the Windows taskbar, left to right after Start. */
export const taskbarPins: IconId[] = [
  "files",
  "browser",
  "mail",
  "notes",
  "messages",
  "photos",
  "store",
  "resume",
  "assistant",
  "settings",
];

export type PhoneAppId = Exclude<AppId, "about">;

export type HomeItem =
  | { kind: "app"; id: PhoneAppId }
  | { kind: "deco"; icon: DecoIconId }
  | { kind: "widget" };

/** Home-screen pages (4 columns, up to 24 cells each). Dock apps don't repeat here. */
export const phoneHomePages: HomeItem[][] = [
  [
    { kind: "widget" },
    { kind: "app", id: "photos" },
    { kind: "app", id: "store" },
    { kind: "app", id: "resume" },
    { kind: "deco", icon: "files" },
    { kind: "deco", icon: "mail" },
    { kind: "app", id: "settings" },
  ],
];

export const phoneDock: PhoneAppId[] = ["notes", "messages", "browser", "assistant"];

/** Android runs Google's apps: Keep for the intro, Chrome, Play Store, a Drive PDF viewer… */
export const androidLabels: Record<IconId, string> = {
  notes: "Keep Notes",
  messages: "Messages",
  browser: "Chrome",
  store: "Play Store",
  photos: "Photos",
  resume: "Résumé",
  assistant: "Assistant",
  files: "Files",
  mail: "Gmail",
  settings: "Settings",
};

/** The Android home screen: the profile widget, then apps in a 4-column grid. The dock sits below. */
export const androidHome: HomeItem[] = [
  { kind: "widget" },
  { kind: "app", id: "photos" },
  { kind: "app", id: "store" },
  { kind: "app", id: "resume" },
  { kind: "app", id: "settings" },
  { kind: "deco", icon: "files" },
  { kind: "deco", icon: "mail" },
];

export const androidDock: PhoneAppId[] = ["messages", "browser", "notes", "assistant"];
