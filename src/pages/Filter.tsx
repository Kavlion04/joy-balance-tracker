import { useEffect, useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarDays, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { format } from "date-fns";
import { ru, enUS, uz } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { TransactionCard } from "@/components/TransactionCard";
import { EditTransactionModal } from "@/components/EditTransactionModal";
import { formatMoney } from "@/lib/categories";
import type { Transaction, TxType } from "@/lib/types";
import type { DateRange } from "react-day-picker";

const localeMap = { ru, uz, en: enUS };
type Preset = "2d" | "3d" | "7d" | "custom";

const Filter = () => {
  const { user } = useAuth();
  const { t, lang } = useI18n();
  const dfns = localeMap[lang];

  const buildRange = (days: number): DateRange => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - (days - 1));
    return { from, to };
  };

  const [preset, setPreset] = useState<Preset>("3d");
  const [range, setRange] = useState<DateRange | undefined>(() => buildRange(3));
  const [tab, setTab] = useState<TxType | "all">("all");
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [editTx, setEditTx] = useState<Transaction | null>(null);

  const applyPreset = (p: Preset) => {
    setPreset(p);
    if (p === "2d") setRange(buildRange(2));
    else if (p === "3d") setRange(buildRange(3));
    else if (p === "7d") setRange(buildRange(7));
  };

  const load = async () => {
    if (!user || !range?.from) return;
    const fromStr = format(range.from, "yyyy-MM-dd");
    const toStr = format(range.to ?? range.from, "yyyy-MM-dd");
    const { data } = await supabase.from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .gte("occurred_on", fromStr)
      .lte("occurred_on", toStr)
      .order("occurred_on", { ascending: false });
    setTxs((data ?? []) as Transaction[]);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user, range?.from, range?.to]);

  const totals = useMemo(() => {
    const inc = txs.filter(tx => tx.type === "income").reduce((s, tx) => s + Number(tx.amount), 0);
    const exp = txs.filter(tx => tx.type === "expense").reduce((s, tx) => s + Number(tx.amount), 0);
    return { inc, exp };
  }, [txs]);

  const filtered = tab === "all" ? txs : txs.filter(tx => tx.type === tab);

  const label = range?.from
    ? range.to && format(range.from, "yyyy-MM-dd") !== format(range.to, "yyyy-MM-dd")
      ? `${format(range.from, "d MMM", { locale: dfns })} — ${format(range.to, "d MMM yyyy", { locale: dfns })}`
      : format(range.from, "d MMMM yyyy", { locale: dfns })
    : t("pick_period");

  const presets: { id: Preset; label: string }[] = [
    { id: "2d", label: t("range_2d") },
    { id: "3d", label: t("range_3d") },
    { id: "7d", label: t("range_7d") },
    { id: "custom", label: t("custom") },
  ];

  return (
    <div className="pb-32 max-w-md mx-auto px-4 pt-6">
      <h1 className="text-2xl font-bold tracking-tight mb-1">{t("filter")}</h1>
      <p className="text-sm text-muted-foreground mb-6">{t("filter_sub")}</p>

      {/* Quick range presets */}
      <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-muted/40 mb-3">
        {presets.map(p => (
          <button
            key={p.id}
            onClick={() => applyPreset(p.id)}
            className={cn(
              "py-2 rounded-xl text-xs font-medium transition-smooth",
              preset === p.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom range picker (shown only when custom is active) */}
      {preset === "custom" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full h-12 justify-start glass border-border/30 rounded-2xl mb-3">
              <CalendarDays className="mr-2 h-4 w-4 text-primary" />
              {label}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-popover" align="center">
            <Calendar
              mode="range"
              selected={range}
              onSelect={setRange}
              locale={dfns}
              numberOfMonths={1}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      )}

      {preset !== "custom" && (
        <div className="glass rounded-2xl p-3 text-center text-sm text-muted-foreground border-border/30 mb-3">
          <CalendarDays className="inline h-4 w-4 mr-1.5 text-primary" />
          {label}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mt-1">
        <div className="glass rounded-2xl p-4 border-border/30">
          <div className="flex items-center gap-1.5 text-income text-xs">
            <ArrowUpCircle className="h-3.5 w-3.5" /> {t("income")}
          </div>
          <p className="font-bold mt-1">{formatMoney(totals.inc, lang)}</p>
        </div>
        <div className="glass rounded-2xl p-4 border-border/30">
          <div className="flex items-center gap-1.5 text-expense text-xs">
            <ArrowDownCircle className="h-3.5 w-3.5" /> {t("expense")}
          </div>
          <p className="font-bold mt-1">{formatMoney(totals.exp, lang)}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-muted/40 my-4">
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
            {t("no_ops_period")}
          </div>
        ) : (
          filtered.map(tx => <TransactionCard key={tx.id} tx={tx} onDeleted={load} onEdit={setEditTx} />)
        )}
      </div>
      <EditTransactionModal open={!!editTx} onOpenChange={(o) => !o && setEditTx(null)} tx={editTx} onSaved={load} />
    </div>
  );
};

export default Filter;
