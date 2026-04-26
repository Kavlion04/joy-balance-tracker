export const INCOME_CATEGORIES = [
  { id: "salary", label: "Зарплата", emoji: "💼" },
  { id: "freelance", label: "Фриланс", emoji: "💻" },
  { id: "gift", label: "Подарок", emoji: "🎁" },
  { id: "investment", label: "Инвестиции", emoji: "📈" },
  { id: "other_income", label: "Другое", emoji: "✨" },
] as const;

export const EXPENSE_CATEGORIES = [
  { id: "food", label: "Еда", emoji: "🍔" },
  { id: "transport", label: "Транспорт", emoji: "🚕" },
  { id: "shopping", label: "Покупки", emoji: "🛍️" },
  { id: "bills", label: "Счета", emoji: "🧾" },
  { id: "entertainment", label: "Развлечения", emoji: "🎬" },
  { id: "health", label: "Здоровье", emoji: "💊" },
  { id: "education", label: "Образование", emoji: "📚" },
  { id: "other_expense", label: "Другое", emoji: "💫" },
] as const;

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

export function getCategory(id: string) {
  return ALL_CATEGORIES.find((c) => c.id === id) ?? { id, label: id, emoji: "•" };
}

export function formatMoney(n: number) {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(n) + " сум";
}
