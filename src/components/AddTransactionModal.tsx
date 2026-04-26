import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/lib/categories";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { TxType } from "@/lib/types";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSaved: () => void;
}

export const AddTransactionModal = ({ open, onOpenChange, onSaved }: Props) => {
  const { user } = useAuth();
  const [type, setType] = useState<TxType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>("");
  const [comment, setComment] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [saving, setSaving] = useState(false);

  const cats = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const reset = () => {
    setType("expense"); setAmount(""); setCategory(""); setComment(""); setDate(new Date());
  };

  const handleSave = async () => {
    if (!user) return;
    const num = parseFloat(amount.replace(",", "."));
    if (!num || num <= 0) { toast.error("Введите сумму"); return; }
    if (!category) { toast.error("Выберите категорию"); return; }

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

    if (error) { toast.error("Ошибка: " + error.message); return; }
    toast.success(type === "income" ? "Доход добавлен" : "Расход добавлен");
    reset();
    onOpenChange(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="glass border-border/40 max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Новая операция</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-muted/50">
            <button
              type="button"
              onClick={() => { setType("expense"); setCategory(""); }}
              className={cn(
                "flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-smooth",
                type === "expense" ? "gradient-expense text-expense-foreground shadow-card-soft" : "text-muted-foreground"
              )}
            >
              <ArrowDownCircle className="h-4 w-4" /> Расход
            </button>
            <button
              type="button"
              onClick={() => { setType("income"); setCategory(""); }}
              className={cn(
                "flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-smooth",
                type === "income" ? "gradient-primary text-primary-foreground shadow-card-soft" : "text-muted-foreground"
              )}
            >
              <ArrowUpCircle className="h-4 w-4" /> Доход
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label>Сумма</Label>
            <Input
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-14 text-2xl font-semibold text-center bg-muted/50 border-border/50 rounded-2xl"
            />
          </div>

          {/* Category select */}
          <div className="space-y-1.5">
            <Label>Категория</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-12 bg-muted/50 border-border/50 rounded-2xl">
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {cats.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    <span className="mr-2">{c.emoji}</span>{c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date picker */}
          <div className="space-y-1.5">
            <Label>Дата</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full h-12 justify-start bg-muted/50 border-border/50 rounded-2xl font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "d MMMM yyyy", { locale: ru })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                  locale={ru}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <Label>Комментарий</Label>
            <Textarea
              placeholder="Необязательно"
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
            {saving ? "Сохранение…" : "Сохранить"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
