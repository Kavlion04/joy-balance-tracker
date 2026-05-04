import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { ru, enUS, uz } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { cn } from "@/lib/utils";
import { formatMoney, getCategory } from "@/lib/categories";
import type { Transaction, TxType } from "@/lib/types";

const COLORS = [
  "hsl(152 76% 50%)",
  "hsl(270 80% 65%)",
  "hsl(35 95% 60%)",
  "hsl(200 90% 60%)",
  "hsl(0 80% 62%)",
  "hsl(330 80% 65%)",
  "hsl(180 70% 55%)",
  "hsl(50 90% 55%)",
];

const localeMap = { ru, uz, en: enUS };
type Period = "day" | "week" | "month" | "custom";

const Stats = () => {
  const { user } = useAuth();
  const { t, lang } = useI18n();
  const dfns = localeMap[lang];
  const [period, setPeriod] = useState<Period>("month");
  const [type, setType] = useState<TxType>("expense");
  const [txs, setTxs] = useState<Transaction[]>([]);

  const buildRange = (days: number): DateRange => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - (days - 1));
    return { from, to };
  };
  const [range, setRange] = useState<DateRange | undefined>(() => buildRange(30));

  const applyPeriod = (p: Period) => {
    setPeriod(p);
    if (p === "day") setRange(buildRange(1));
    else if (p === "week") setRange(buildRange(7));
    else if (p === "month") setRange(buildRange(30));
  };

  useEffect(() => {
    if (!user || !range?.from) return;
    const fromStr = format(range.from, "yyyy-MM-dd");
    const toStr = format(range.to ?? range.from, "yyyy-MM-dd");

    supabase.from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .gte("occurred_on", fromStr)
      .lte("occurred_on", toStr)
      .then(({ data }) => setTxs((data ?? []) as Transaction[]));
  }, [user, range?.from, range?.to]);

  const data = useMemo(() => {
    const map = new Map<string, number>();
    txs.filter(tx => tx.type === type).forEach(tx => {
      map.set(tx.category, (map.get(tx.category) ?? 0) + Number(tx.amount));
    });
    return Array.from(map.entries())
      .map(([cat, value]) => {
        const c = getCategory(cat);
        return { cat, value, label: c.name[lang], emoji: c.emoji };
      })
      .sort((a, b) => b.value - a.value);
  }, [txs, type, lang]);

  const total = data.reduce((s, d) => s + d.value, 0);

  const rangeLabel = range?.from
    ? range.to && format(range.from, "yyyy-MM-dd") !== format(range.to, "yyyy-MM-dd")
      ? `${format(range.from, "d MMM", { locale: dfns })} — ${format(range.to, "d MMM yyyy", { locale: dfns })}`
      : format(range.from, "d MMMM yyyy", { locale: dfns })
    : t("pick_period");

  return (
    <div className="pb-32 max-w-md mx-auto px-4 pt-6">
      <h1 className="text-2xl font-bold tracking-tight mb-1">{t("statistics")}</h1>
      <p className="text-sm text-muted-foreground mb-6">{t("by_category")}</p>

      <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-muted/40 mb-3">
        {([
          { id: "day" as const, label: t("day") },
          { id: "week" as const, label: t("week") },
          { id: "month" as const, label: t("month") },
          { id: "custom" as const, label: t("custom") },
        ]).map(p => (
          <button
            key={p.id}
            onClick={() => applyPeriod(p.id)}
            className={cn(
              "py-2 rounded-xl text-xs font-medium transition-smooth",
              period === p.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {period === "custom" ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full h-12 justify-start glass border-border/30 rounded-2xl mb-3">
              <CalendarDays className="mr-2 h-4 w-4 text-primary" />
              {rangeLabel}
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
      ) : (
        <div className="glass rounded-2xl p-3 text-center text-sm text-muted-foreground border-border/30 mb-3">
          <CalendarDays className="inline h-4 w-4 mr-1.5 text-primary" />
          {rangeLabel}
        </div>
      )}

      <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-muted/40 mb-6">
        {([
          { id: "expense" as const, label: t("expense") },
          { id: "income" as const, label: t("income") },
        ]).map(tab => (
          <button
            key={tab.id}
            onClick={() => setType(tab.id)}
            className={cn(
              "py-2 rounded-xl text-xs font-medium transition-smooth",
              type === tab.id
                ? tab.id === "income"
                  ? "bg-income text-income-foreground"
                  : "bg-expense text-expense-foreground"
                : "text-muted-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass rounded-3xl p-6 shadow-card-soft border-border/30 mb-4">
        {data.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">{t("no_data")}</div>
        ) : (
          <>
            <div className="relative h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => formatMoney(v, lang)}
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-xs text-muted-foreground">{t("total")}</p>
                <p className="text-xl font-bold">{formatMoney(total, lang)}</p>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              {data.map((d, i) => {
                const pct = total ? (d.value / total) * 100 : 0;
                return (
                  <div key={d.cat} className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ background: COLORS[i % COLORS.length] }}
                    />
                    <span className="text-sm flex-1 truncate">{d.emoji} {d.label}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">{pct.toFixed(0)}%</span>
                    <span className="text-sm font-semibold tabular-nums">{formatMoney(d.value, lang)}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Stats;
