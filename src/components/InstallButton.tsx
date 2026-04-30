import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Download, Smartphone, Share, Plus } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/contexts/I18nContext";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const ua = () => (typeof navigator !== "undefined" ? navigator.userAgent : "");
const isIOS = () =>
  /iPad|iPhone|iPod/.test(ua()) && !(window as unknown as { MSStream?: unknown }).MSStream;
// On iOS, only Safari can install PWAs. Chrome (CriOS), Firefox (FxiOS), Edge (EdgiOS) cannot.
const isIOSSafari = () => isIOS() && !/CriOS|FxiOS|EdgiOS|OPiOS|YaBrowser|DuckDuckGo/.test(ua());

export const InstallButton = () => {
  const { t } = useI18n();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [iosOpen, setIosOpen] = useState(false);

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

    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    ) {
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
      return;
    }
    if (isIOS()) {
      setIosOpen(true);
      return;
    }
    toast.info(t("install_unavailable"));
  };

  if (installed) return null;

  const onIOS = isIOS();
  const safariOnIOS = isIOSSafari();

  return (
    <>
      <Button
        onClick={handleInstall}
        variant="outline"
        className="w-full h-12 rounded-2xl border-primary/40 text-primary hover:bg-primary/10 hover:text-primary"
      >
        {onIOS ? <Smartphone className="h-4 w-4 mr-2" /> : <Download className="h-4 w-4 mr-2" />}
        {t("install_app")}
      </Button>

      <Dialog open={iosOpen} onOpenChange={setIosOpen}>
        <DialogContent className="glass border-border/30 rounded-3xl max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("install_ios_title")}</DialogTitle>
            <DialogDescription>
              {safariOnIOS ? t("install_hint_ios") : t("install_ios_safari_only")}
            </DialogDescription>
          </DialogHeader>

          {safariOnIOS && (
            <ol className="space-y-3 mt-2">
              <li className="flex items-start gap-3 p-3 rounded-2xl bg-muted/40 border border-border/30">
                <div className="h-8 w-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0 font-semibold text-sm">
                  1
                </div>
                <div className="flex-1 text-sm">
                  <p>{t("install_ios_step1")}</p>
                  <Share className="h-5 w-5 text-primary mt-1.5" />
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-2xl bg-muted/40 border border-border/30">
                <div className="h-8 w-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0 font-semibold text-sm">
                  2
                </div>
                <div className="flex-1 text-sm">
                  <p>{t("install_ios_step2")}</p>
                  <Plus className="h-5 w-5 text-primary mt-1.5" />
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-2xl bg-muted/40 border border-border/30">
                <div className="h-8 w-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0 font-semibold text-sm">
                  3
                </div>
                <div className="flex-1 text-sm">
                  <p>{t("install_ios_step3")}</p>
                </div>
              </li>
            </ol>
          )}

          <DialogFooter>
            <Button
              onClick={() => setIosOpen(false)}
              className="w-full h-11 rounded-2xl gradient-primary text-primary-foreground"
            >
              {t("got_it")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
