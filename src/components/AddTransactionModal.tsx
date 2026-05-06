import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowDownCircle, ArrowUpCircle, Plus } from "lucide-react";
import { format } from "date-fns";
import { ru, enUS, uz } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useCategories } from "@/contexts/CategoriesContext";
import { NewCategoryDialog } from "./NewCategoryDialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { toast } from "sonner";
import type { TxType } from "@/lib/types";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSaved: () => void;
}

const localeMap = { ru, uz, en: enUS };

export const AddTransactionModal = ({ open, onOpenChange, onSaved }: Props) => {
  const { user } = useAuth();
  const { t, lang } = useI18n();
  const dfnsLocale = localeMap[lang];
  const [type, setType] = useState<TxType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>("");
  const [comment, setComment] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [saving, setSaving] = useState(false);
  const [newCatOpen, setNewCatOpen] = useState(false);

  const { list } = useCategories();
  const cats = list(type);

  const reset = () => {
    setType("expense"); setAmount(""); setCategory(""); setComment(""); setDate(new Date());
  };

  const handleSave = async () => {
    if (!user) return;
    const num = parseFloat(amount.replace(",", "."));
    if (!num || num <= 0) { toast.error(t("enter_amount")); return; }
    if (!category) { toast.error(t("pick_cat_err")); return; }

    setSaving(true);
    const { error } = await supabase.from("transactions").insert({
      user_id: user.id,
      type,
      amount: num,
      category,
      comment: comment.trim() || null,
      occurred_on: format(date, "yyyy-MM-dd"),
    });
    setSaving(false);

    if (error) { console.error("Transaction save failed:", error); toast.error(t("save_failed")); return; }
    toast.success(type === "income" ? t("added_income") : t("added_expense"));
    reset();
    onOpenChange(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="glass border-border/40 max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("new_op")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-muted/50">
            <button
              type="button"
              onClick={() => { setType("expense"); setCategory(""); }}
              className={cn(
                "flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-smooth",
                type === "expense" ? "gradient-expense text-expense-foreground shadow-card-soft" : "text-muted-foreground"
              )}
            >
              <ArrowDownCircle className="h-4 w-4" /> {t("expense_short")}
            </button>
            <button
              type="button"
              onClick={() => { setType("income"); setCategory(""); }}
              className={cn(
                "flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-smooth",
                type === "income" ? "gradient-primary text-primary-foreground shadow-card-soft" : "text-muted-foreground"
              )}
            >
              <ArrowUpCircle className="h-4 w-4" /> {t("income_short")}
            </button>
          </div>

          <div className="space-y-1.5">
            <Label>{t("amount")}</Label>
            <Input
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-14 text-2xl font-semibold text-center bg-muted/50 border-border/50 rounded-2xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t("category")}</Label>
            <div className="flex gap-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-12 bg-muted/50 border-border/50 rounded-2xl flex-1">
                  <SelectValue placeholder={t("pick_category")} />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {cats.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <span className="mr-2">{c.emoji}</span>{c.name[lang]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" variant="outline"
                onClick={() => setNewCatOpen(true)}
                className="h-12 w-12 rounded-2xl shrink-0 border-border/50 bg-muted/50"
                aria-label={t("new_category")}>
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>{t("date")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full h-12 justify-start bg-muted/50 border-border/50 rounded-2xl font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "d MMMM yyyy", { locale: dfnsLocale })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                  locale={dfnsLocale}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5">
            <Label>{t("comment")}</Label>
            <Textarea
              placeholder={t("optional")}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={200}
              rows={2}
              className="bg-muted/50 border-border/50 rounded-2xl resize-none"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              "w-full h-14 rounded-2xl text-base font-semibold transition-bounce",
              type === "income" ? "gradient-primary text-primary-foreground" : "gradient-expense text-expense-foreground"
            )}
          >
            {saving ? t("saving") : t("save")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    <NewCategoryDialog open={newCatOpen} onOpenChange={setNewCatOpen} type={type} onCreated={(id) => setCategory(id)} />
    </>
  );
};
