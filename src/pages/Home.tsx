import { useEffect, useState, useMemo } from "react";
import { Plus, LogOut, ArrowUpCircle, ArrowDownCircle, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parseISO, isToday } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { TransactionCard } from "@/components/TransactionCard";
import { formatMoney } from "@/lib/categories";
import type { Transaction, TxType } from "@/lib/types";

const Home = () => {
  const { user, signOut } = useAuth();
  const [date, setDate] = useState<Date>(new Date());
  const [tab, setTab] = useState<TxType | "all">("all");
  const [open, setOpen] = useState(false);
  const [txs, setTxs] = useState<Transaction[]>([]);

  const dateStr = format(date, "yyyy-MM-dd");

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .eq("occurred_on", dateStr)
      .order("created_at", { ascending: false });
    setTxs((data ?? []) as Transaction[]);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user, dateStr]);

  const totals = useMemo(() => {
    const inc = txs.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const exp = txs.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    return { inc, exp, balance: inc - exp };
  }, [txs]);

  const filtered = tab === "all" ? txs : txs.filter(t => t.type === tab);

  return (
    <div className="pb-32 max-w-md mx-auto px-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-muted-foreground">Привет 👋</p>
          <h1 className="text-2xl font-bold tracking-tight">Мои финансы</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={signOut}
          className="rounded-2xl glass border-border/30"
          aria-label="Выйти"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      {/* Date picker */}
      <Popover>
        <PopoverTrigger asChild>
          <button className="w-full glass rounded-2xl p-3 flex items-center justify-center gap-2 mb-4 transition-smooth hover:bg-muted/40">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">
              {isToday(date) ? "Сегодня" : ""} {format(date, "d MMMM yyyy", { locale: ru })}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-popover" align="center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => d && setDate(d)}
            locale={ru}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>

      {/* Balance card */}
      <div className="glass rounded-3xl p-5 mb-4 shadow-card-soft border-border/30">
        <p className="text-xs text-muted-foreground">Баланс за день</p>
        <p className={cn(
          "text-3xl font-bold mt-1 tracking-tight",
          totals.balance >= 0 ? "text-income" : "text-expense"
        )}>
          {totals.balance >= 0 ? "+" : "−"}{formatMoney(Math.abs(totals.balance))}
        </p>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="rounded-2xl bg-income/10 p-3">
            <div className="flex items-center gap-1.5 text-income text-xs">
              <ArrowUpCircle className="h-3.5 w-3.5" /> Доходы
            </div>
            <p className="font-bold mt-1 text-sm">{formatMoney(totals.inc)}</p>
          </div>
          <div className="rounded-2xl bg-expense/10 p-3">
            <div className="flex items-center gap-1.5 text-expense text-xs">
              <ArrowDownCircle className="h-3.5 w-3.5" /> Расходы
            </div>
            <p className="font-bold mt-1 text-sm">{formatMoney(totals.exp)}</p>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-muted/40 mb-4">
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

      {/* List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Нет операций. Нажмите + чтобы добавить.
          </div>
        ) : (
          filtered.map(tx => <TransactionCard key={tx.id} tx={tx} onDeleted={load} />)
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-1/2 translate-x-[180px] z-30 h-16 w-16 rounded-full gradient-primary text-primary-foreground flex items-center justify-center shadow-fab transition-bounce hover:scale-110 active:scale-95"
        aria-label="Добавить операцию"
      >
        <Plus className="h-7 w-7" strokeWidth={2.5} />
      </button>

      <AddTransactionModal open={open} onOpenChange={setOpen} onSaved={load} />
    </div>
  );
};

export default Home;
