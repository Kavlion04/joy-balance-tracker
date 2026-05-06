import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, type CategoryDef } from "@/lib/categories";
import type { CustomCategory, TxType } from "@/lib/types";

export function useCategories(type: TxType) {
  const { user } = useAuth();
  const [custom, setCustom] = useState<CustomCategory[]>([]);

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("custom_categories")
      .select("*")
      .eq("user_id", user.id)
      .eq("type", type)
      .order("created_at", { ascending: true });
    setCustom((data ?? []) as CustomCategory[]);
  }, [user, type]);

  useEffect(() => { load(); }, [load]);

  const base = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const all: CategoryDef[] = [
    ...base,
    ...custom.map((c) => ({
      id: `custom:${c.id}`,
      emoji: c.emoji,
      name: { ru: c.name, uz: c.name, en: c.name },
    })),
  ];

  return { all, custom, reload: load };
}
