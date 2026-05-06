import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { getThemeMode, setThemeMode } from "@/lib/theme";
import { useI18n } from "@/contexts/I18nContext";
import { cn } from "@/lib/utils";
import type { ThemeMode } from "@/lib/types";

export const ThemeSettings = () => {
  const { t } = useI18n();
  const [mode, setMode] = useState<ThemeMode>(getThemeMode());
  useEffect(() => { setMode(getThemeMode()); }, []);

  const opts: { id: ThemeMode; label: string; Icon: typeof Sun }[] = [
    { id: "light", label: t("theme_light"), Icon: Sun },
    { id: "dark", label: t("theme_dark"), Icon: Moon },
    { id: "system", label: t("theme_system"), Icon: Monitor },
  ];

  return (
    <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-muted/40">
      {opts.map(({ id, label, Icon }) => (
        <button key={id}
          onClick={() => { setThemeMode(id); setMode(id); }}
          className={cn(
            "flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-medium transition-smooth",
            mode === id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
          )}>
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
};
