import { useEffect, useState } from "react";
import { Smartphone, Monitor, Globe, Wifi, WifiOff, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DeviceInfo {
  name: string;
  os: string;
  browser: string;
  screen: string;
  online: boolean;
}

const detect = (): DeviceInfo => {
  const ua = navigator.userAgent;
  let os = "Unknown";
  if (/Windows/i.test(ua)) os = "Windows";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Mac/i.test(ua)) os = "macOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  let browser = "Browser";
  if (/Edg/i.test(ua)) browser = "Edge";
  else if (/Chrome/i.test(ua)) browser = "Chrome";
  else if (/Safari/i.test(ua)) browser = "Safari";
  else if (/Firefox/i.test(ua)) browser = "Firefox";

  const isMobile = /Mobi|Android|iPhone/i.test(ua);
  return {
    name: isMobile ? "Mobile" : "Desktop",
    os,
    browser,
    screen: `${window.screen.width}×${window.screen.height}`,
    online: navigator.onLine,
  };
};

export const DeviceSettings = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const [info, setInfo] = useState<DeviceInfo>(detect());
  const [signingOutAll, setSigningOutAll] = useState(false);

  useEffect(() => {
    const u = () => setInfo(detect());
    window.addEventListener("online", u);
    window.addEventListener("offline", u);
    return () => {
      window.removeEventListener("online", u);
      window.removeEventListener("offline", u);
    };
  }, []);

  const signOutOthers = async () => {
    setSigningOutAll(true);
    const { error } = await supabase.auth.signOut({ scope: "others" });
    setSigningOutAll(false);
    if (error) toast.error(t("save_failed"));
    else toast.success(t("other_sessions_signed_out"));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-muted/30 p-4 space-y-2 border border-border/30">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Smartphone className="h-4 w-4 text-primary" />
          {t("current_device")}
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2"><Monitor className="h-3.5 w-3.5 text-muted-foreground" /> {info.name}</div>
          <div className="flex items-center gap-2"><Globe className="h-3.5 w-3.5 text-muted-foreground" /> {info.os}</div>
          <div className="flex items-center gap-2 col-span-2"><span className="text-muted-foreground">{t("browser")}:</span> {info.browser}</div>
          <div className="flex items-center gap-2 col-span-2"><span className="text-muted-foreground">{t("screen")}:</span> {info.screen}</div>
          <div className="flex items-center gap-2 col-span-2">
            {info.online
              ? <><Wifi className="h-3.5 w-3.5 text-income" /> <span className="text-income">{t("online")}</span></>
              : <><WifiOff className="h-3.5 w-3.5 text-expense" /> <span className="text-expense">{t("offline")}</span></>}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-muted/30 p-4 space-y-2 border border-border/30">
        <p className="text-xs text-muted-foreground">{t("other_sessions_desc")}</p>
        <Button onClick={signOutOthers} disabled={signingOutAll || !user}
          variant="outline" className="w-full h-11 rounded-2xl border-expense/40 text-expense hover:bg-expense/10 hover:text-expense">
          <LogOut className="h-4 w-4 mr-2" />
          {signingOutAll ? t("saving") : t("sign_out_others")}
        </Button>
      </div>
    </div>
  );
};
