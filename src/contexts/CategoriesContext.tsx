import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, type CategoryDef } from "@/lib/categories";
import type { CustomCategory, TxType } from "@/lib/types";

interface Ctx {
  customs: CustomCategory[];
  byId: Record<string, CategoryDef>;
  list: (type: TxType) => CategoryDef[];
  add: (type: TxType, name: string, emoji: string) => Promise<void>;
  update: (id: string, patch: { name?: string; emoji?: string }) => Promise<void>;
  remove: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const C = createContext<Ctx>({
  customs: [],
  byId: {},
  list: () => [],
  add: async () => {},
  update: async () => {},
  remove: async () => {},
  refresh: async () => {},
});

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [customs, setCustoms] = useState<CustomCategory[]>([]);

  const refresh = useCallback(async () => {
    if (!user) { setCustoms([]); return; }
    const { data } = await supabase
      .from("custom_categories")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    setCustoms((data ?? []) as CustomCategory[]);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const toDef = (c: CustomCategory): CategoryDef => ({
    id: `custom:${c.id}`,
    emoji: c.emoji,
    name: { ru: c.name, uz: c.name, en: c.name },
  });

  const byId: Record<string, CategoryDef> = {};
  [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES].forEach((c) => (byId[c.id] = c));
  customs.forEach((c) => (byId[`custom:${c.id}`] = toDef(c)));

  const list = (type: TxType) => {
    const base = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    return [...base, ...customs.filter((c) => c.type === type).map(toDef)];
  };

  const add = async (type: TxType, name: string, emoji: string) => {
    if (!user) return;
    await supabase.from("custom_categories").insert({ user_id: user.id, type, name, emoji });
    await refresh();
  };
  const update = async (id: string, patch: { name?: string; emoji?: string }) => {
    await supabase.from("custom_categories").update(patch).eq("id", id);
    await refresh();
  };
  const remove = async (id: string) => {
    await supabase.from("custom_categories").delete().eq("id", id);
    await refresh();
  };

  return (
    <C.Provider value={{ customs, byId, list, add, update, remove, refresh }}>
      {children}
    </C.Provider>
  );
};

export const useCategories = () => useContext(C);
