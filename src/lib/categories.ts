import type { Lang } from "./i18n";

type Loc = { ru: string; uz: string; en: string };

export interface CategoryDef {
  id: string;
  emoji: string;
  name: Loc;
}

export const INCOME_CATEGORIES: CategoryDef[] = [
  { id: "salary", emoji: "💼", name: { ru: "Зарплата", uz: "Maosh", en: "Salary" } },
  { id: "freelance", emoji: "💻", name: { ru: "Фриланс", uz: "Frilans", en: "Freelance" } },
  { id: "gift", emoji: "🎁", name: { ru: "Подарок", uz: "Sovg‘a", en: "Gift" } },
  { id: "investment", emoji: "📈", name: { ru: "Инвестиции", uz: "Investitsiya", en: "Investment" } },
  { id: "other_income", emoji: "✨", name: { ru: "Другое", uz: "Boshqa", en: "Other" } },
];

export const EXPENSE_CATEGORIES: CategoryDef[] = [
  { id: "food", emoji: "🍔", name: { ru: "Еда", uz: "Ovqat", en: "Food" } },
  { id: "transport", emoji: "🚕", name: { ru: "Транспорт", uz: "Transport", en: "Transport" } },
  { id: "shopping", emoji: "🛍️", name: { ru: "Покупки", uz: "Xaridlar", en: "Shopping" } },
  { id: "bills", emoji: "🧾", name: { ru: "Счета", uz: "Hisoblar", en: "Bills" } },
  { id: "entertainment", emoji: "🎬", name: { ru: "Развлечения", uz: "Ko‘ngilochar", en: "Entertainment" } },
  { id: "health", emoji: "💊", name: { ru: "Здоровье", uz: "Sog‘liq", en: "Health" } },
  { id: "education", emoji: "📚", name: { ru: "Образование", uz: "Ta’lim", en: "Education" } },
  { id: "other_expense", emoji: "💫", name: { ru: "Другое", uz: "Boshqa", en: "Other" } },
];

const ALL = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

export function getCategory(id: string): CategoryDef {
  return ALL.find((c) => c.id === id) ?? { id, emoji: "•", name: { ru: id, uz: id, en: id } };
}

export function categoryLabel(id: string, lang: Lang) {
  return getCategory(id).name[lang];
}

export function formatMoney(n: number, lang: Lang = "ru") {
  const locale = lang === "ru" ? "ru-RU" : lang === "uz" ? "uz-UZ" : "en-US";
  const currency = lang === "ru" ? "сум" : lang === "uz" ? "so‘m" : "UZS";
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(n) + " " + currency;
}
