/**
 * DOM nodes of launcher icons, keyed by app id. The desktop dock (or taskbar) uses it as the
 * minimise flight target; the phone uses it to zoom apps in and out of their icon.
 */
export const dockIcons = new Map<string, HTMLElement>();
export const phoneIcons = new Map<string, HTMLElement>();
/** Open desktop windows, so a taskbar click can minimise one towards its icon. */
export const windowEls = new Map<string, HTMLElement>();

/** Vector from a window's centre to its launcher icon's centre. */
export function minimizeDelta(id: string) {
  const win = windowEls.get(id)?.getBoundingClientRect();
  const icon = dockIcons.get(id)?.getBoundingClientRect();
  if (!win || !icon) return { dx: 0, dy: 300 };
  return {
    dx: icon.left + icon.width / 2 - (win.left + win.width / 2),
    dy: icon.top + icon.height / 2 - (win.top + win.height / 2),
  };
}
