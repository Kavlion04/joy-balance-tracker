import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { cn } from "@/lib/utils";

export const OfflineBanner = () => {
  const { t } = useI18n();
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const goOnline = () => { setOnline(true); setShow(true); setTimeout(() => setShow(false), 2000); };
    const goOffline = () => { setOnline(false); setShow(true); };
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    if (!navigator.onLine) setShow(true);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed top-0 inset-x-0 z-[60] py-2 px-3 text-center text-xs font-medium transition-all",
        online ? "bg-income/90 text-white" : "bg-expense/90 text-white"
      )}
      role="status"
    >
      <span className="inline-flex items-center gap-2">
        {!online && <WifiOff className="h-3.5 w-3.5" />}
        {online ? t("back_online") : t("you_are_offline")}
      </span>
    </div>
  );
};
