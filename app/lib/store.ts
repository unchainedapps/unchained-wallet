// ──────────────────────────────────────────────
// Unchained Wallet — localStorage Data Store
// ──────────────────────────────────────────────

import type {
  AppData,
  Budget,
  MonthlyStats,
  Transaction,
  UserProfile,
} from "./types";
import { generateId, getCurrentMonthRange } from "./utils";

const STORAGE_KEY = "unchained-wallet-data";

// ─── Default Data ────────────────────────────

const DEFAULT_PROFILE: UserProfile = {
  name: "",
  currency: "USD",
  currencySymbol: "$",
  onboardingComplete: false,
  createdAt: new Date().toISOString(),
};

function getDefaultData(): AppData {
  return {
    profile: { ...DEFAULT_PROFILE },
    transactions: [],
    budgets: [],
  };
}

// ─── Core Read / Write ───────────────────────

export function loadData(): AppData {
  if (typeof window === "undefined") return getDefaultData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();
    return JSON.parse(raw) as AppData;
  } catch {
    return getDefaultData();
  }
}

export function saveData(data: AppData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ─── Profile ─────────────────────────────────

export function getProfile(): UserProfile {
  return loadData().profile;
}

export function updateProfile(updates: Partial<UserProfile>): UserProfile {
  const data = loadData();
  data.profile = { ...data.profile, ...updates };
  saveData(data);
  return data.profile;
}

export function isOnboardingComplete(): boolean {
  return loadData().profile.onboardingComplete;
}

// ─── Transactions ────────────────────────────

export function getTransactions(): Transaction[] {
  return loadData().transactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function addTransaction(
  tx: Omit<Transaction, "id" | "createdAt">
): Transaction {
  const data = loadData();
  const newTx: Transaction = {
    ...tx,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  data.transactions.push(newTx);
  saveData(data);
  return newTx;
}

export function updateTransaction(
  id: string,
  updates: Partial<Transaction>
): Transaction | null {
  const data = loadData();
  const idx = data.transactions.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  data.transactions[idx] = { ...data.transactions[idx], ...updates };
  saveData(data);
  return data.transactions[idx];
}

export function deleteTransaction(id: string): boolean {
  const data = loadData();
  const before = data.transactions.length;
  data.transactions = data.transactions.filter((t) => t.id !== id);
  saveData(data);
  return data.transactions.length < before;
}

// ─── Budgets ─────────────────────────────────

export function getBudgets(): Budget[] {
  return loadData().budgets;
}

export function addBudget(budget: Omit<Budget, "id" | "createdAt">): Budget {
  const data = loadData();
  // Remove existing budget for same category
  data.budgets = data.budgets.filter((b) => b.category !== budget.category);
  const newBudget: Budget = {
    ...budget,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  data.budgets.push(newBudget);
  saveData(data);
  return newBudget;
}

export function updateBudget(
  id: string,
  updates: Partial<Budget>
): Budget | null {
  const data = loadData();
  const idx = data.budgets.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  data.budgets[idx] = { ...data.budgets[idx], ...updates };
  saveData(data);
  return data.budgets[idx];
}

export function deleteBudget(id: string): boolean {
  const data = loadData();
  const before = data.budgets.length;
  data.budgets = data.budgets.filter((b) => b.id !== id);
  saveData(data);
  return data.budgets.length < before;
}

// ─── Statistics ──────────────────────────────

export function getMonthlyStats(): MonthlyStats {
  const { start, end } = getCurrentMonthRange();
  const transactions = getTransactions().filter(
    (t) => t.date >= start && t.date <= end
  );

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income,
    expenses,
    balance: income - expenses,
    transactionCount: transactions.length,
  };
}

export function getTotalBalance(): number {
  const transactions = getTransactions();
  return transactions.reduce((sum, t) => {
    return t.type === "income" ? sum + t.amount : sum - t.amount;
  }, 0);
}

export function getSpendingByCategory(): { category: string; total: number }[] {
  const { start, end } = getCurrentMonthRange();
  const expenses = getTransactions().filter(
    (t) => t.type === "expense" && t.date >= start && t.date <= end
  );

  const map = new Map<string, number>();
  for (const tx of expenses) {
    map.set(tx.category, (map.get(tx.category) ?? 0) + tx.amount);
  }

  return Array.from(map.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

export function getBudgetSpent(categoryId: string): number {
  const { start, end } = getCurrentMonthRange();
  return getTransactions()
    .filter(
      (t) =>
        t.type === "expense" &&
        t.category === categoryId &&
        t.date >= start &&
        t.date <= end
    )
    .reduce((sum, t) => sum + t.amount, 0);
}

// ─── Export / Import ─────────────────────────

export function exportData(): string {
  return JSON.stringify(loadData(), null, 2);
}

export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as AppData;
    if (!data.profile || !data.transactions || !data.budgets) return false;
    saveData(data);
    return true;
  } catch {
    return false;
  }
}

export function clearAllData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
