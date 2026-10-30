"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { appIds, windowConfig, type AppId } from "./apps";
import { clampGeom, desktopSize, sameGeom, type Geom, type Size } from "./geometry";
import type { DesktopSkin } from "./platform";

export type MinimizeDelta = { dx: number; dy: number };

export type WinState = {
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  z: number;
  geom: Geom;
  /** Vector from window centre to its dock icon, measured when minimising. */
  delta: MinimizeDelta | null;
};

type State = { skin: DesktopSkin; zTop: number; wins: Record<AppId, WinState> };

type Action =
  | { type: "open"; id: AppId; desk: Size }
  | { type: "close"; id: AppId }
  | { type: "focus"; id: AppId }
  | { type: "minimize"; id: AppId; delta: MinimizeDelta }
  | { type: "toggleMax"; id: AppId }
  | { type: "geom"; id: AppId; geom: Geom }
  | { type: "clamp"; desk: Size };

/** Each desktop skin keeps its own windows: what's open on macOS never carries over to Windows. */
const storageKey = (skin: DesktopSkin) => (skin === "windows" ? "kc-os:layout:windows:v1" : "kc-os:layout:v1");
const Z_RENORMALISE = 500;

function raise(state: State, id: AppId, patch: Partial<WinState>): State {
  let zTop = state.zTop + 1;
  let wins = { ...state.wins, [id]: { ...state.wins[id], ...patch, z: zTop } };
  if (zTop > Z_RENORMALISE) {
    const order = appIds.filter((i) => wins[i].open).sort((a, b) => wins[a].z - wins[b].z);
    wins = { ...wins };
    order.forEach((i, n) => (wins[i] = { ...wins[i], z: n + 1 }));
    zTop = order.length;
  }
  return { ...state, zTop, wins };
}

function patch(state: State, id: AppId, p: Partial<WinState>): State {
  return { ...state, wins: { ...state.wins, [id]: { ...state.wins[id], ...p } } };
}

function reducer(state: State, action: Action): State {
  if (action.type === "clamp") {
    let changed = false;
    const wins = { ...state.wins };
    for (const id of appIds) {
      const g = clampGeom(wins[id].geom, windowConfig(id, state.skin).min, action.desk);
      if (!sameGeom(g, wins[id].geom)) {
        wins[id] = { ...wins[id], geom: g };
        changed = true;
      }
    }
    return changed ? { ...state, wins } : state;
  }

  const w = state.wins[action.id];
  const cfg = windowConfig(action.id, state.skin);
  switch (action.type) {
    case "open": {
      if (w.open && !w.minimized && w.z === state.zTop) return state;
      if (w.open) return raise(state, action.id, { minimized: false });
      const narrow =
        cfg.maximizable &&
        (action.desk.w < w.geom.w + 48 || action.desk.h < w.geom.h + 24);
      return raise(state, action.id, {
        open: true,
        minimized: false,
        maximized: narrow,
        delta: null,
        geom: clampGeom(w.geom, cfg.min, action.desk),
      });
    }
    case "close":
      return patch(state, action.id, { open: false, minimized: false, maximized: false });
    case "focus":
      return w.z === state.zTop ? state : raise(state, action.id, {});
    case "minimize":
      return patch(state, action.id, { minimized: true, delta: action.delta });
    case "toggleMax":
      return cfg.maximizable ? patch(state, action.id, { maximized: !w.maximized }) : state;
    case "geom":
      return sameGeom(w.geom, action.geom) ? state : patch(state, action.id, { geom: action.geom });
  }
}

function defaults(skin: DesktopSkin): State {
  const wins = {} as Record<AppId, WinState>;
  for (const id of appIds) {
    const cfg = windowConfig(id, skin);
    wins[id] = {
      open: cfg.openByDefault,
      minimized: false,
      maximized: false,
      z: cfg.openByDefault ? 1 : 0,
      geom: { ...cfg.geom },
      delta: null,
    };
  }
  return { skin, zTop: 1, wins };
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;
const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

function isGeom(g: unknown): g is Geom {
  return isObj(g) && isNum(g.x) && isNum(g.y) && isNum(g.w) && isNum(g.h) && g.w >= 120 && g.h >= 120;
}

function load(skin: DesktopSkin): State {
  const state = defaults(skin);
  let raw: unknown = null;
  try {
    raw = JSON.parse(localStorage.getItem(storageKey(skin)) ?? "null");
  } catch {}

  if (isObj(raw) && isObj(raw.wins)) {
    for (const id of appIds) {
      const s = raw.wins[id];
      if (!isObj(s)) continue;
      const w = state.wins[id];
      const cfg = windowConfig(id, skin);
      if (typeof s.open === "boolean") w.open = s.open;
      if (typeof s.minimized === "boolean") w.minimized = w.open && s.minimized;
      if (typeof s.maximized === "boolean") w.maximized = w.open && cfg.maximizable && s.maximized;
      if (isNum(s.z) && s.z >= 0) w.z = Math.floor(s.z);
      if (isGeom(s.geom)) {
        w.geom = cfg.resizable
          ? { x: s.geom.x, y: s.geom.y, w: s.geom.w, h: s.geom.h }
          : { ...cfg.geom, x: s.geom.x, y: s.geom.y };
      }
    }
  }

  const desk = desktopSize(skin);
  state.zTop = Math.max(0, ...appIds.map((id) => state.wins[id].z));
  for (const id of appIds) {
    state.wins[id].geom = clampGeom(state.wins[id].geom, windowConfig(id, skin).min, desk);
  }

  // openByDefault apps (Notes, the introduction) always greet a visit: open, restored and in front,
  // whatever the saved layout says. Other windows keep their saved state.
  for (const id of appIds) {
    const cfg = windowConfig(id, skin);
    const w = state.wins[id];
    if (!cfg.openByDefault) continue;
    if (!w.open) {
      w.open = true;
      w.maximized = cfg.maximizable && (desk.w < w.geom.w + 48 || desk.h < w.geom.h + 24);
    }
    w.minimized = false;
    w.z = ++state.zTop;
  }
  return state;
}

function save(state: State, skin: DesktopSkin) {
  const wins: Record<string, Omit<WinState, "delta">> = {};
  for (const id of appIds) {
    const { open, minimized, maximized, z, geom } = state.wins[id];
    wins[id] = { open, minimized, maximized, z, geom };
  }
  try {
    localStorage.setItem(storageKey(skin), JSON.stringify({ wins }));
  } catch {}
}

export function useWindowManager(skin: DesktopSkin = "macos") {
  const [desk, setDesk] = useState<Size>(() => desktopSize(skin));
  const [state, dispatch] = useReducer(reducer, skin, load);

  // Track the viewport live (maximised windows follow it), re-clamp geoms after it settles.
  useEffect(() => {
    let t: number | undefined;
    const onResize = () => {
      const d = desktopSize(skin);
      if (d.w < 320 || d.h < 240) return;
      setDesk(d);
      clearTimeout(t);
      t = window.setTimeout(() => dispatch({ type: "clamp", desk: d }), 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
    };
  }, [skin]);

  const latest = useRef(state);
  useEffect(() => {
    latest.current = state;
    const t = setTimeout(() => save(state, skin), 250);
    return () => clearTimeout(t);
  }, [state, skin]);

  useEffect(() => {
    const flush = () => save(latest.current, skin);
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onVisibility);
      // Switching device style remounts the desktop; keep the layout it leaves behind.
      flush();
    };
  }, [skin]);

  const activeId = useMemo(() => {
    let top: AppId | null = null;
    for (const id of appIds) {
      const w = state.wins[id];
      if (w.open && !w.minimized && (!top || w.z > state.wins[top].z)) top = id;
    }
    return top;
  }, [state.wins]);

  const actions = useMemo(
    () => ({
      open: (id: AppId) => dispatch({ type: "open", id, desk: desktopSize(skin) }),
      close: (id: AppId) => dispatch({ type: "close", id }),
      focus: (id: AppId) => dispatch({ type: "focus", id }),
      minimize: (id: AppId, delta: MinimizeDelta) => dispatch({ type: "minimize", id, delta }),
      toggleMaximize: (id: AppId) => dispatch({ type: "toggleMax", id }),
      setGeom: (id: AppId, geom: Geom) => dispatch({ type: "geom", id, geom }),
    }),
    [skin],
  );

  return { wins: state.wins, desk, activeId, ...actions };
}
