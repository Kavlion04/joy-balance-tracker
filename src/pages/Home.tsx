import { useEffect, useState, useMemo } from "react";
import { Plus, ArrowUpCircle, ArrowDownCircle, CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isToday } from "date-fns";
import { ru, enUS, uz } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { TransactionCard } from "@/components/TransactionCard";
import { LangSwitcher } from "@/components/LangSwitcher";
import { formatMoney } from "@/lib/categories";
import type { Transaction, TxType } from "@/lib/types";

const localeMap = { ru, uz, en: enUS };

const Home = () => {
  const { user, signOut } = useAuth();
  const { t, lang } = useI18n();
  const dfns = localeMap[lang];
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
      .is("deleted_at", null)
      .order("created_at", { ascending: false });
    setTxs((data ?? []) as Transaction[]);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user, dateStr]);

  const totals = useMemo(() => {
    const inc = txs.filter(tx => tx.type === "income").reduce((s, tx) => s + Number(tx.amount), 0);
    const exp = txs.filter(tx => tx.type === "expense").reduce((s, tx) => s + Number(tx.amount), 0);
    return { inc, exp, balance: inc - exp };
  }, [txs]);

  const filtered = tab === "all" ? txs : txs.filter(tx => tx.type === tab);

  return (
    <div className="pb-32 max-w-md mx-auto px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-muted-foreground">{t("hello")}</p>
          <h1 className="text-2xl font-bold tracking-tight">{t("my_finances")}</h1>
        </div>
        <div className="flex items-center gap-2">
          <LangSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className="rounded-2xl glass border-border/30"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <button className="w-full glass rounded-2xl p-3 flex items-center justify-center gap-2 mb-4 transition-smooth hover:bg-muted/40">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">
              {isToday(date) ? t("today") + " · " : ""}{format(date, "d MMMM yyyy", { locale: dfns })}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-popover" align="center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => d && setDate(d)}
            locale={dfns}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>

      <div className="glass rounded-3xl p-5 mb-4 shadow-card-soft border-border/30">
        <p className="text-xs text-muted-foreground">{t("balance_day")}</p>
        <p className={cn(
          "text-3xl font-bold mt-1 tracking-tight",
          totals.balance >= 0 ? "text-income" : "text-expense"
        )}>
          {totals.balance >= 0 ? "+" : "−"}{formatMoney(Math.abs(totals.balance), lang)}
        </p>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="rounded-2xl bg-income/10 p-3">
            <div className="flex items-center gap-1.5 text-income text-xs">
              <ArrowUpCircle className="h-3.5 w-3.5" /> {t("income")}
            </div>
            <p className="font-bold mt-1 text-sm">{formatMoney(totals.inc, lang)}</p>
          </div>
          <div className="rounded-2xl bg-expense/10 p-3">
            <div className="flex items-center gap-1.5 text-expense text-xs">
              <ArrowDownCircle className="h-3.5 w-3.5" /> {t("expense")}
            </div>
            <p className="font-bold mt-1 text-sm">{formatMoney(totals.exp, lang)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-muted/40 mb-4">
        {([
          { id: "all" as const, label: t("all") },
          { id: "income" as const, label: t("income_short") },
          { id: "expense" as const, label: t("expense_short") },
        ]).map(tabItem => (
          <button
            key={tabItem.id}
            onClick={() => setTab(tabItem.id)}
            className={cn(
              "py-2 rounded-xl text-xs font-medium transition-smooth",
              tab === tabItem.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            {t("no_ops_today")}
          </div>
        ) : (
          filtered.map(tx => <TransactionCard key={tx.id} tx={tx} onDeleted={load} />)
        )}
      </div>

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-1/2 translate-x-[180px] z-30 h-16 w-16 rounded-full gradient-primary text-primary-foreground flex items-center justify-center shadow-fab transition-bounce hover:scale-110 active:scale-95"
        aria-label="Add"
      >
        <Plus className="h-7 w-7" strokeWidth={2.5} />
      </button>

      <AddTransactionModal open={open} onOpenChange={setOpen} onSaved={load} />
    </div>
  );
};

export default Home;
