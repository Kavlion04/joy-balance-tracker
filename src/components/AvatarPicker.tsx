import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useI18n } from "@/contexts/I18nContext";

interface Props {
  size?: number;
}

export const AvatarPicker = ({ size = 96 }: Props) => {
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
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, cacheControl: "3600", contentType: file.type });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const res = await update({ avatar_url: data.publicUrl });
      if (res.error) throw new Error(res.error);
      toast.success(t("saved"));
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("upload_failed");
      console.error("Avatar upload failed:", err);
      toast.error(`${t("upload_failed")}: ${msg}`);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = async () => {
    setBusy(true);
    const res = await update({ avatar_url: null });
    if (res.error) toast.error(res.error);
    setBusy(false);
  };

  const initials = (profile?.display_name || "?").slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <Avatar style={{ height: size, width: size }} className="ring-2 ring-primary/30">
          <AvatarImage src={profile?.avatar_url ?? undefined} />
          <AvatarFallback className="text-2xl gradient-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="absolute -bottom-1 -right-1 h-9 w-9 rounded-full gradient-primary flex items-center justify-center shadow-fab text-primary-foreground transition-bounce hover:scale-105 active:scale-95 disabled:opacity-60"
          aria-label={t("upload_avatar")}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFile}
      />
      {profile?.avatar_url && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={remove}
          disabled={busy}
          className="text-xs text-muted-foreground"
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          {t("remove_avatar")}
        </Button>
      )}
    </div>
  );
};
