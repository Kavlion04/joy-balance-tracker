import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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

const Stats = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState<"day" | "week" | "month">("month");
  const [type, setType] = useState<TxType>("expense");
  const [txs, setTxs] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!user) return;
    const now = new Date();
    const from = new Date(now);
    if (period === "day") from.setDate(now.getDate());
    else if (period === "week") from.setDate(now.getDate() - 6);
    else from.setDate(now.getDate() - 29);
    const fromStr = from.toISOString().slice(0, 10);
    const toStr = now.toISOString().slice(0, 10);

    supabase.from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .gte("occurred_on", fromStr)
      .lte("occurred_on", toStr)
      .then(({ data }) => setTxs((data ?? []) as Transaction[]));
  }, [user, period]);

  const data = useMemo(() => {
    const map = new Map<string, number>();
    txs.filter(t => t.type === type).forEach(t => {
      map.set(t.category, (map.get(t.category) ?? 0) + Number(t.amount));
    });
    return Array.from(map.entries())
      .map(([cat, value]) => ({ cat, value, label: getCategory(cat).label, emoji: getCategory(cat).emoji }))
      .sort((a, b) => b.value - a.value);
  }, [txs, type]);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="pb-32 max-w-md mx-auto px-4 pt-6">
      <h1 className="text-2xl font-bold tracking-tight mb-1">Статистика</h1>
      <p className="text-sm text-muted-foreground mb-6">Распределение по категориям</p>

      {/* Period switch */}
      <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-muted/40 mb-3">
        {([
          { id: "day", label: "День" },
          { id: "week", label: "Неделя" },
          { id: "month", label: "Месяц" },
        ] as const).map(p => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className={cn(
              "py-2 rounded-xl text-xs font-medium transition-smooth",
              period === p.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Type switch */}
      <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-muted/40 mb-6">
        {([
          { id: "expense" as const, label: "Расходы" },
          { id: "income" as const, label: "Доходы" },
        ]).map(t => (
          <button
            key={t.id}
            onClick={() => setType(t.id)}
            className={cn(
              "py-2 rounded-xl text-xs font-medium transition-smooth",
              type === t.id
                ? t.id === "income"
                  ? "bg-income text-income-foreground"
                  : "bg-expense text-expense-foreground"
                : "text-muted-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Donut */}
      <div className="glass rounded-3xl p-6 shadow-card-soft border-border/30 mb-4">
        {data.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">Нет данных за период</div>
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
                    formatter={(v: number) => formatMoney(v)}
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-xs text-muted-foreground">Всего</p>
                <p className="text-xl font-bold">{formatMoney(total)}</p>
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
                    <span className="text-sm font-semibold tabular-nums">{formatMoney(d.value)}</span>
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
