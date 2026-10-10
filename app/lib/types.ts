// ──────────────────────────────────────────────
// Unchained Wallet — TypeScript Interfaces
// ──────────────────────────────────────────────

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO string
  createdAt: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  period: "monthly";
  createdAt: string;
}

export interface UserProfile {
  name: string;
  currency: string;
  currencySymbol: string;
  onboardingComplete: boolean;
  createdAt: string;
}

export interface AppData {
  profile: UserProfile;
  transactions: Transaction[];
  budgets: Budget[];
}

export interface CategoryDefinition {
  id: string;
  label: string;
  icon: string; // Lucide icon name
  type: "expense" | "income" | "both";
}

export interface MonthlyStats {
  income: number;
  expenses: number;
  balance: number;
  transactionCount: number;
}
