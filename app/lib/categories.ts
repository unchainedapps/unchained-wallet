// ──────────────────────────────────────────────
// Unchained Wallet — Category Definitions
// ──────────────────────────────────────────────

import type { CategoryDefinition } from "./types";

export const EXPENSE_CATEGORIES: CategoryDefinition[] = [
  { id: "food", label: "Food & Dining", icon: "UtensilsCrossed", type: "expense" },
  { id: "transport", label: "Transport", icon: "Car", type: "expense" },
  { id: "shopping", label: "Shopping", icon: "ShoppingBag", type: "expense" },
  { id: "entertainment", label: "Entertainment", icon: "Film", type: "expense" },
  { id: "bills", label: "Bills & Utilities", icon: "Zap", type: "expense" },
  { id: "health", label: "Health", icon: "Heart", type: "expense" },
  { id: "education", label: "Education", icon: "GraduationCap", type: "expense" },
  { id: "housing", label: "Housing & Rent", icon: "Home", type: "expense" },
  { id: "subscriptions", label: "Subscriptions", icon: "CreditCard", type: "expense" },
  { id: "personal", label: "Personal Care", icon: "Sparkles", type: "expense" },
  { id: "other_expense", label: "Other", icon: "MoreHorizontal", type: "expense" },
];

export const INCOME_CATEGORIES: CategoryDefinition[] = [
  { id: "salary", label: "Salary", icon: "Briefcase", type: "income" },
  { id: "freelance", label: "Freelance", icon: "Laptop", type: "income" },
  { id: "investments", label: "Investments", icon: "TrendingUp", type: "income" },
  { id: "gifts", label: "Gifts", icon: "Gift", type: "income" },
  { id: "other_income", label: "Other Income", icon: "ArrowDownLeft", type: "income" },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export function getCategoryById(id: string): CategoryDefinition | undefined {
  return ALL_CATEGORIES.find((c) => c.id === id);
}

export function getCategoryLabel(id: string): string {
  return getCategoryById(id)?.label ?? id;
}

export function getCategoryIcon(id: string): string {
  return getCategoryById(id)?.icon ?? "MoreHorizontal";
}
