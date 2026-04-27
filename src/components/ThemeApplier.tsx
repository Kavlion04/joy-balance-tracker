import { useEffect } from "react";
import { useProfile } from "@/contexts/ProfileContext";

const SIZE_PX: Record<string, string> = {
  sm: "14px",
  md: "16px",
  lg: "18px",
};

export const ThemeApplier = () => {
  const { profile } = useProfile();

  useEffect(() => {
    const root = document.documentElement;

    // Accent color (overrides --primary)
    if (profile?.accent_color) {
      root.style.setProperty("--primary", profile.accent_color);
      root.style.setProperty("--ring", profile.accent_color);
    } else {
      root.style.removeProperty("--primary");
      root.style.removeProperty("--ring");
    }

    // Text size
    root.style.fontSize = SIZE_PX[profile?.text_size ?? "md"];

    // Background image
    if (profile?.background_url) {
      document.body.style.backgroundImage = `linear-gradient(hsl(var(--background) / 0.85), hsl(var(--background) / 0.85)), url(${profile.background_url})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
    } else {
      document.body.style.backgroundImage = "";
    }
  }, [profile?.accent_color, profile?.text_size, profile?.background_url]);

  return null;
};
