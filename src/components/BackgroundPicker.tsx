import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useI18n } from "@/contexts/I18nContext";

export const BackgroundPicker = () => {
  const { user } = useAuth();
  const { profile, update } = useProfile();
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setBusy(true);
    try {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const path = `${user.id}/bg-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("backgrounds")
        .upload(path, file, { upsert: true, cacheControl: "3600", contentType: file.type });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("backgrounds").getPublicUrl(path);
      const res = await update({ background_url: data.publicUrl });
      if (res.error) throw new Error(res.error);
      toast.success(t("saved"));
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("upload_failed");
      console.error("Background upload failed:", err);
      toast.error(`${t("upload_failed")}: ${msg}`);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = async () => {
    setBusy(true);
    const res = await update({ background_url: null });
    if (res.error) toast.error(res.error);
    setBusy(false);
  };

  return (
    <div className="space-y-3">
      <div
        className="relative h-32 rounded-2xl overflow-hidden border border-border/30 bg-muted/40 flex items-center justify-center"
        style={
          profile?.background_url
            ? { backgroundImage: `url(${profile.background_url})`, backgroundSize: "cover", backgroundPosition: "center" }
            : undefined
        }
      >
        {!profile?.background_url && (
          <span className="text-xs text-muted-foreground">{t("no_background")}</span>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex-1 h-11 rounded-2xl gradient-primary text-primary-foreground"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : (
            <><ImagePlus className="h-4 w-4 mr-2" />{t("upload_background")}</>
          )}
        </Button>
        {profile?.background_url && (
          <Button
            type="button"
            variant="outline"
            onClick={remove}
            disabled={busy}
            className="h-11 rounded-2xl border-expense/40 text-expense hover:bg-expense/10 hover:text-expense"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFile}
      />
    </div>
  );
};
