import { Button } from "@/components/ui/button";
import { useProfile } from "@/contexts/ProfileContext";
import { useI18n } from "@/contexts/I18nContext";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { TextSize } from "@/lib/types";

const COLORS: { name: string; value: string }[] = [
  { name: "Emerald", value: "152 76% 50%" },
  { name: "Violet", value: "270 80% 65%" },
  { name: "Orange", value: "25 95% 60%" },
  { name: "Sky", value: "200 90% 60%" },
  { name: "Rose", value: "340 82% 62%" },
  { name: "Yellow", value: "48 96% 56%" },
];

const SIZES: { id: TextSize; label: string }[] = [
  { id: "sm", label: "A−" },
  { id: "md", label: "A" },
  { id: "lg", label: "A+" },
];

export const AppearanceSettings = () => {
  const { profile, update } = useProfile();
  const { t } = useI18n();
  const current = profile?.accent_color ?? null;
  const size = profile?.text_size ?? "md";

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs text-muted-foreground mb-2">{t("accent_color")}</p>
        <div className="flex gap-2 flex-wrap">
          {COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => update({ accent_color: c.value })}
              className={cn(
                "h-10 w-10 rounded-2xl flex items-center justify-center transition-bounce hover:scale-110 ring-2",
                current === c.value ? "ring-foreground" : "ring-transparent"
              )}
              style={{ background: `hsl(${c.value})` }}
              aria-label={c.name}
            >
              {current === c.value && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
            </button>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => update({ accent_color: null })}
            className="h-10 rounded-2xl px-3 text-xs"
          >
            {t("reset")}
          </Button>
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2">{t("text_size")}</p>
        <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-muted/40">
          {SIZES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => update({ text_size: s.id })}
              className={cn(
                "py-2 rounded-xl font-medium transition-smooth",
                s.id === "sm" && "text-sm",
                s.id === "md" && "text-base",
                s.id === "lg" && "text-lg",
                size === s.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
