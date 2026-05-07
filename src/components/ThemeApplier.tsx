import { useEffect } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { applyTheme, getThemeMode } from "@/lib/theme";

const SIZE_PX: Record<string, string> = {
  sm: "14px",
  md: "16px",
  lg: "18px",
};

export const ThemeApplier = () => {
  const { profile } = useProfile();

  useEffect(() => {
    applyTheme(getThemeMode());
    const onChange = () => applyTheme(getThemeMode());
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    window.addEventListener("theme-changed", onChange);
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("theme-changed", onChange);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    if (profile?.accent_color) {
      root.style.setProperty("--primary", profile.accent_color);
      root.style.setProperty("--ring", profile.accent_color);
    } else {
      root.style.removeProperty("--primary");
      root.style.removeProperty("--ring");
    }

    root.style.fontSize = SIZE_PX[profile?.text_size ?? "md"];

    if (profile?.background_url) {
      const isDark = root.classList.contains("dark");
      const overlay = isDark
        ? "linear-gradient(135deg, hsl(var(--primary) / 0.18), hsl(var(--background) / 0.55) 60%, hsl(280 70% 40% / 0.18))"
        : "linear-gradient(hsl(var(--background) / 0.72), hsl(var(--background) / 0.72))";
      document.body.style.backgroundImage = `${overlay}, url(${profile.background_url})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
    } else {
      document.body.style.backgroundImage = "";
    }
  }, [profile?.accent_color, profile?.text_size, profile?.background_url]);

  return null;
};
