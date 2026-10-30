// Kept out of the client theme module so the root layout (a server component)
// can inline it as a plain string.
export const THEME_KEY = "kc-os:theme";

export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;
