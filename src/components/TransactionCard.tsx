import { Card } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, Trash2, Pencil } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ru, enUS, uz } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { formatMoney, getCategory as baseGetCategory } from "@/lib/categories";
import { useCategories } from "@/contexts/CategoriesContext";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/contexts/I18nContext";
import { toast } from "sonner";
import type { Transaction } from "@/lib/types";

const localeMap = { ru, uz, en: enUS };

interface Props {
  tx: Transaction;
  onDeleted: () => void;
  onEdit?: (tx: Transaction) => void;
}

export const TransactionCard = ({ tx, onDeleted, onEdit }: Props) => {
  const { lang, t } = useI18n();
  const { byId } = useCategories();
  const cat = byId[tx.category] ?? baseGetCategory(tx.category);
  const isIncome = tx.type === "income";

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await supabase
      .from("transactions")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", tx.id);
    if (error) toast.error(t("delete_failed"));
    else { toast.success(t("deleted")); onDeleted(); }
  };

  return (
    <Card
      onClick={() => onEdit?.(tx)}
      className="glass border-border/30 rounded-2xl p-4 flex items-center gap-3 shadow-card-soft transition-smooth hover:scale-[1.02] cursor-pointer active:scale-[0.99]"
    >
      <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-2xl shrink-0",
        isIncome ? "bg-income/15" : "bg-expense/15")}>
        {cat.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {isIncome ? <ArrowUpCircle className="h-3.5 w-3.5 text-income" /> : <ArrowDownCircle className="h-3.5 w-3.5 text-expense" />}
          <p className="font-medium truncate">{cat.name[lang]}</p>
        </div>
        {tx.comment && <p className="text-xs text-muted-foreground truncate">{tx.comment}</p>}
        <p className="text-[10px] text-muted-foreground/70 mt-0.5">
          {format(parseISO(tx.occurred_on), "d MMM yyyy", { locale: localeMap[lang] })}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className={cn("font-semibold whitespace-nowrap", isIncome ? "text-income" : "text-expense")}>
          {isIncome ? "+" : "−"}{formatMoney(Number(tx.amount), lang)}
        </p>
        <div className="flex items-center justify-end gap-2 mt-1">
          <Pencil className="h-3.5 w-3.5 text-muted-foreground/60" />
          <button onClick={handleDelete} className="text-muted-foreground/50 hover:text-expense transition-smooth" aria-label="Delete">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </Card>
  );
};
