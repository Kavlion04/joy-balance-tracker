import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/contexts/I18nContext";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;

export const InstallButton = () => {
  const { t } = useI18n();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
      toast.success(t("installed"));
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [t]);

  const handleInstall = async () => {
    if (deferred) {
      await deferred.prompt();
      await deferred.userChoice;
      setDeferred(null);
    } else if (isIOS()) {
      toast.info(t("install_hint_ios"), { duration: 6000 });
    } else {
      toast.info(t("install_unavailable"));
    }
  };

  if (installed) return null;

  return (
    <Button
      onClick={handleInstall}
      variant="outline"
      className="w-full h-12 rounded-2xl border-primary/40 text-primary hover:bg-primary/10 hover:text-primary"
    >
      {isIOS() ? <Smartphone className="h-4 w-4 mr-2" /> : <Download className="h-4 w-4 mr-2" />}
      {t("install_app")}
    </Button>
  );
};
