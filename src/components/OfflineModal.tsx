import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useI18n } from "@/contexts/I18nContext";

export const OfflineModal = () => {
  const { t } = useI18n();
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  return (
    <Dialog open={!online}>
      <DialogContent
        className="glass border-border/30 rounded-3xl max-w-xs text-center [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="h-16 w-16 rounded-2xl bg-expense/15 text-expense flex items-center justify-center">
            <WifiOff className="h-8 w-8" />
          </div>
          <DialogTitle className="text-lg font-semibold">{t("you_are_offline")}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t("offline_modal_desc")}
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
};
