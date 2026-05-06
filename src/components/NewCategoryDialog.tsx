import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/contexts/I18nContext";
import { useCategories } from "@/contexts/CategoriesContext";
import { toast } from "sonner";
import type { TxType } from "@/lib/types";

const EMOJIS = ["✨","🎯","🍕","☕","🚗","✈️","🏠","🎮","💪","🐶","🎵","💡","📱","💼","🛒","🎁","💰","📚","🌿","⚽"];

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  type: TxType;
  onCreated?: (newId: string) => void;
}

export const NewCategoryDialog = ({ open, onOpenChange, type, onCreated }: Props) => {
  const { t } = useI18n();
  const { add, customs } = useCategories();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("✨");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim()) { toast.error(t("enter_name")); return; }
    setSaving(true);
    const before = new Set(customs.map((c) => c.id));
    await add(type, name.trim(), emoji);
    setSaving(false);
    toast.success(t("saved"));
    setName(""); setEmoji("✨");
    onOpenChange(false);
    // best-effort: tell parent to select the most recent one
    setTimeout(async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase.from("custom_categories").select("id").eq("type", type).order("created_at", { ascending: false }).limit(1);
      const id = data?.[0]?.id;
      if (id && !before.has(id)) onCreated?.(`custom:${id}`);
    }, 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border/40 max-w-sm rounded-3xl">
        <DialogHeader><DialogTitle>{t("new_category")}</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>{t("name")}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={30}
              className="h-12 bg-muted/50 border-border/50 rounded-2xl" autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label>{t("emoji")}</Label>
            <div className="grid grid-cols-10 gap-1.5">
              {EMOJIS.map((e) => (
                <button key={e} type="button" onClick={() => setEmoji(e)}
                  className={`h-9 rounded-xl text-lg transition-smooth ${emoji === e ? "bg-primary/30 ring-2 ring-primary" : "bg-muted/40 hover:bg-muted/70"}`}>
                  {e}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={save} disabled={saving} className="w-full h-12 rounded-2xl gradient-primary text-primary-foreground">
            {saving ? t("saving") : t("save")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
