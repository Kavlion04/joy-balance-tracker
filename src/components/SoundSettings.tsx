import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/contexts/I18nContext";
import {
  isChimeEnabled,
  setChimeEnabled,
  playWelcomeChime,
} from "@/lib/welcomeChime";

export const SoundSettings = () => {
  const { t } = useI18n();
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(isChimeEnabled());
  }, []);

  const toggle = (next: boolean) => {
    setEnabled(next);
    setChimeEnabled(next);
    if (next) playWelcomeChime();
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium">{t("welcome_chime")}</p>
        <p className="text-xs text-muted-foreground">{t("welcome_chime_desc")}</p>
      </div>
      <Switch checked={enabled} onCheckedChange={toggle} />
    </div>
  );
};
