import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfile } from "@/contexts/ProfileContext";
import { useI18n } from "@/contexts/I18nContext";
import { AvatarPicker } from "./AvatarPicker";
import { Loader2 } from "lucide-react";

export const WelcomeModal = () => {
  const { profile, update, loading } = useProfile();
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const open = !loading && !!profile && !profile.onboarded;

  const handleContinue = async () => {
    setSaving(true);
    await update({
      display_name: name.trim() || profile?.display_name || null,
      onboarded: true,
    });
    setSaving(false);
  };

  const handleSkip = async () => {
    setSaving(true);
    await update({ onboarded: true });
    setSaving(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent className="glass border-border/30 rounded-3xl max-w-sm" hideClose>
        <DialogHeader>
          <DialogTitle className="text-center text-xl">{t("welcome")}</DialogTitle>
          <DialogDescription className="text-center">{t("welcome_sub")}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <AvatarPicker size={104} />
        </div>

        <div className="space-y-1.5">
          <Label>{t("display_name")}</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("your_name")}
            className="h-12 bg-muted/50 border-border/50 rounded-2xl"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleSkip}
            disabled={saving}
            className="rounded-2xl h-12"
          >
            {t("skip")}
          </Button>
          <Button
            type="button"
            onClick={handleContinue}
            disabled={saving}
            className="rounded-2xl h-12 gradient-primary text-primary-foreground font-semibold"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : t("continue")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
