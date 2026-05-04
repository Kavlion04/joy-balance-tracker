import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import {
  hasBiometric,
  isPlatformAuthenticatorAvailable,
  enrollBiometric,
  disableBiometric,
  clearPin,
  lock,
} from "@/lib/pinLock";

export const SecuritySettings = ({ onChangePin }: { onChangePin: () => void }) => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [bioOn, setBioOn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    isPlatformAuthenticatorAvailable().then(setSupported);
  }, []);

  useEffect(() => {
    if (user) setBioOn(hasBiometric(user.id));
  }, [user]);

  const toggleBio = async (next: boolean) => {
    if (!user) return;
    setBusy(true);
    try {
      if (next) {
        await enrollBiometric(user.id, user.email ?? "user");
        setBioOn(true);
        toast.success(t("biometric_enabled"));
      } else {
        disableBiometric(user.id);
        setBioOn(false);
      }
    } catch {
      toast.error(t("biometric_failed"));
    } finally {
      setBusy(false);
    }
  };

  const changePin = () => {
    if (!user) return;
    clearPin(user.id);
    lock(user.id);
    onChangePin();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="pr-4">
          <p className="text-sm font-medium">{t("biometric")}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {supported ? t("biometric_desc") : t("install_unavailable")}
          </p>
        </div>
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <Switch checked={bioOn} onCheckedChange={toggleBio} disabled={!supported} />
        )}
      </div>
      <Button
        variant="outline"
        onClick={changePin}
        className="w-full h-11 rounded-2xl"
      >
        {t("pin_change")}
      </Button>
    </div>
  );
};
