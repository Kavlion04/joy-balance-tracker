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
      document.body.style.backgroundImage = `linear-gradient(hsl(var(--background) / 0.78), hsl(var(--background) / 0.78)), url(${profile.background_url})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
    } else {
      document.body.style.backgroundImage = "";
    }
  }, [profile?.accent_color, profile?.text_size, profile?.background_url]);

  return null;
};
