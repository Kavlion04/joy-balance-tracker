import { Card } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { formatMoney, getCategory } from "@/lib/categories";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Transaction } from "@/lib/types";

export const TransactionCard = ({ tx, onDeleted }: { tx: Transaction; onDeleted: () => void }) => {
  const cat = getCategory(tx.category);
  const isIncome = tx.type === "income";

  const handleDelete = async () => {
    const { error } = await supabase.from("transactions").delete().eq("id", tx.id);
    if (error) toast.error("Не удалось удалить");
    else { toast.success("Удалено"); onDeleted(); }
  };

  return (
    <Card className="glass border-border/30 rounded-2xl p-4 flex items-center gap-3 shadow-card-soft transition-smooth hover:scale-[1.02]">
      <div
        className={cn(
          "h-12 w-12 rounded-2xl flex items-center justify-center text-2xl shrink-0",
          isIncome ? "bg-income/15" : "bg-expense/15"
        )}
      >
        {cat.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {isIncome ? (
            <ArrowUpCircle className="h-3.5 w-3.5 text-income" />
          ) : (
            <ArrowDownCircle className="h-3.5 w-3.5 text-expense" />
          )}
          <p className="font-medium truncate">{cat.label}</p>
        </div>
        {tx.comment && <p className="text-xs text-muted-foreground truncate">{tx.comment}</p>}
        <p className="text-[10px] text-muted-foreground/70 mt-0.5">
          {format(parseISO(tx.occurred_on), "d MMM yyyy", { locale: ru })}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className={cn("font-semibold whitespace-nowrap", isIncome ? "text-income" : "text-expense")}>
          {isIncome ? "+" : "−"}
          {formatMoney(Number(tx.amount))}
        </p>
        <button
          onClick={handleDelete}
          className="text-muted-foreground/50 hover:text-expense transition-smooth mt-1"
          aria-label="Удалить"
        >
          <Trash2 className="h-3.5 w-3.5 ml-auto" />
        </button>
      </div>
    </Card>
  );
};
