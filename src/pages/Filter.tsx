import { useEffect, useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarDays, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { TransactionCard } from "@/components/TransactionCard";
import { formatMoney } from "@/lib/categories";
import type { Transaction, TxType } from "@/lib/types";
import type { DateRange } from "react-day-picker";

const Filter = () => {
  const { user } = useAuth();
  const [range, setRange] = useState<DateRange | undefined>(() => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 2);
    return { from, to };
  });
  const [tab, setTab] = useState<TxType | "all">("all");
  const [txs, setTxs] = useState<Transaction[]>([]);

  const load = async () => {
    if (!user || !range?.from) return;
    const fromStr = format(range.from, "yyyy-MM-dd");
    const toStr = format(range.to ?? range.from, "yyyy-MM-dd");
    const { data } = await supabase.from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .gte("occurred_on", fromStr)
      .lte("occurred_on", toStr)
      .order("occurred_on", { ascending: false });
    setTxs((data ?? []) as Transaction[]);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user, range?.from, range?.to]);

  const totals = useMemo(() => {
    const inc = txs.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const exp = txs.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    return { inc, exp };
  }, [txs]);

  const filtered = tab === "all" ? txs : txs.filter(t => t.type === tab);

  const label = range?.from
    ? range.to && format(range.from, "yyyy-MM-dd") !== format(range.to, "yyyy-MM-dd")
      ? `${format(range.from, "d MMM", { locale: ru })} — ${format(range.to, "d MMM yyyy", { locale: ru })}`
      : format(range.from, "d MMMM yyyy", { locale: ru })
    : "Выберите период";

  return (
    <div className="pb-32 max-w-md mx-auto px-4 pt-6">
      <h1 className="text-2xl font-bold tracking-tight mb-1">Фильтр</h1>
      <p className="text-sm text-muted-foreground mb-6">Статистика за выбранные дни</p>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full h-12 justify-start glass border-border/30 rounded-2xl">
            <CalendarDays className="mr-2 h-4 w-4 text-primary" />
            {label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-popover" align="center">
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            locale={ru}
            numberOfMonths={1}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="glass rounded-2xl p-4 border-border/30">
          <div className="flex items-center gap-1.5 text-income text-xs">
            <ArrowUpCircle className="h-3.5 w-3.5" /> Доходы
          </div>
          <p className="font-bold mt-1">{formatMoney(totals.inc)}</p>
        </div>
        <div className="glass rounded-2xl p-4 border-border/30">
          <div className="flex items-center gap-1.5 text-expense text-xs">
            <ArrowDownCircle className="h-3.5 w-3.5" /> Расходы
          </div>
          <p className="font-bold mt-1">{formatMoney(totals.exp)}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-muted/40 my-4">
        {([
          { id: "all", label: "Все" },
          { id: "income", label: "Доход" },
          { id: "expense", label: "Расход" },
        ] as const).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "py-2 rounded-xl text-xs font-medium transition-smooth",
              tab === t.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Нет операций за выбранный период
          </div>
        ) : (
          filtered.map(tx => <TransactionCard key={tx.id} tx={tx} onDeleted={load} />)
        )}
      </div>
    </div>
  );
};

export default Filter;
