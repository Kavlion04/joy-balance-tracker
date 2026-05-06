import type { ThemeMode } from "./types";

const KEY = "theme_mode";

export const getThemeMode = (): ThemeMode => {
  const v = localStorage.getItem(KEY);
  if (v === "light" || v === "dark" || v === "system") return v;
  return "dark";
};

export const setThemeMode = (mode: ThemeMode) => {
  localStorage.setItem(KEY, mode);
  applyTheme(mode);
  window.dispatchEvent(new Event("theme-changed"));
};

export const applyTheme = (mode: ThemeMode) => {
  const root = document.documentElement;
  const resolved =
    mode === "system"
      ? window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark"
      : mode;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
};
