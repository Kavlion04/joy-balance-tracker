import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { useCategories } from "@/contexts/CategoriesContext";
import { useI18n } from "@/contexts/I18nContext";
import { NewCategoryDialog } from "./NewCategoryDialog";
import { cn } from "@/lib/utils";
import type { TxType } from "@/lib/types";

export const CategoriesSettings = () => {
  const { t } = useI18n();
  const { customs, update, remove } = useCategories();
  const [tab, setTab] = useState<TxType>("expense");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const items = customs.filter((c) => c.type === tab);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-muted/40">
        {(["expense", "income"] as TxType[]).map((tp) => (
          <button key={tp} onClick={() => setTab(tp)}
            className={cn("py-2 rounded-xl text-xs font-medium transition-smooth",
              tab === tp ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}>
            {tp === "income" ? t("income_short") : t("expense_short")}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="text-center text-xs text-muted-foreground py-4">{t("no_custom_cats")}</p>
      ) : (
        <div className="space-y-1.5">
          {items.map((c) => (
            <div key={c.id} className="flex items-center gap-2 p-2.5 rounded-2xl bg-muted/30 border border-border/30">
              <span className="text-xl">{c.emoji}</span>
              {editingId === c.id ? (
                <>
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)}
                    className="h-8 flex-1 bg-muted/50 border-border/40 rounded-xl text-sm" />
                  <button onClick={async () => { await update(c.id, { name: editName.trim() || c.name }); setEditingId(null); }}
                    className="h-8 w-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center"><Check className="h-4 w-4" /></button>
                  <button onClick={() => setEditingId(null)}
                    className="h-8 w-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center"><X className="h-4 w-4" /></button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm truncate">{c.name}</span>
                  <button onClick={() => { setEditingId(c.id); setEditName(c.name); }}
                    className="h-8 w-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(c.id)}
                    className="h-8 w-8 rounded-lg bg-expense/15 text-expense flex items-center justify-center"><Trash2 className="h-4 w-4" /></button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <Button onClick={() => setOpen(true)} variant="outline"
        className="w-full h-11 rounded-2xl border-dashed border-border/50">
        <Plus className="h-4 w-4 mr-2" /> {t("new_category")}
      </Button>

      <NewCategoryDialog open={open} onOpenChange={setOpen} type={tab} />
    </div>
  );
};
