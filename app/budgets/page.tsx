"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import BudgetCard from "@/app/components/BudgetCard";
import Card from "@/app/components/Card";
import EmptyState from "@/app/components/EmptyState";
import PageTransition from "@/app/components/PageTransition";
import {
  getBudgets,
  addBudget,
  deleteBudget,
  getBudgetSpent,
  getProfile,
  getMonthlyStats,
} from "@/app/lib/store";
import { EXPENSE_CATEGORIES } from "@/app/lib/categories";
import { formatCurrency, formatMonthYear } from "@/app/lib/utils";
import type { Budget } from "@/app/lib/types";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<(Budget & { spent: number })[]>([]);
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newLimit, setNewLimit] = useState("");
  const [stats, setStats] = useState({ income: 0, expenses: 0, balance: 0, transactionCount: 0 });

  const refresh = useCallback(() => {
    const rawBudgets = getBudgets();
    const enriched = rawBudgets.map((b) => ({
      ...b,
      spent: getBudgetSpent(b.category),
    }));
    setBudgets(enriched);
    setCurrencySymbol(getProfile().currencySymbol);
    setStats(getMonthlyStats());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const limit = parseFloat(newLimit);
    if (!newCategory || !limit) return;
    addBudget({ category: newCategory, limit, period: "monthly" });
    setNewCategory("");
    setNewLimit("");
    setShowForm(false);
    refresh();
  }

  function handleDelete(id: string) {
    deleteBudget(id);
    refresh();
  }

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const existingCategories = new Set(budgets.map((b) => b.category));
  const availableCategories = EXPENSE_CATEGORIES.filter(
    (c) => !existingCategories.has(c.id)
  );

  return (
    <PageTransition>
      <div className="space-y-4 pb-4">
        {/* Overview */}
        <Card padding="lg">
          <p className="text-xs font-medium text-warm-gray uppercase tracking-wider mb-1">
            {formatMonthYear(new Date().toISOString())}
          </p>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-semibold text-charcoal tabular-nums">
                {formatCurrency(totalSpent, currencySymbol)}
              </p>
              <p className="text-xs text-warm-gray">
                of {formatCurrency(totalBudgeted, currencySymbol)} budgeted
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-charcoal tabular-nums">
                {formatCurrency(stats.expenses, currencySymbol)}
              </p>
              <p className="text-xs text-warm-gray">total spent</p>
            </div>
          </div>
        </Card>

        {/* Budget Cards */}
        {budgets.length > 0 ? (
          <div className="space-y-3">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                category={budget.category}
                limit={budget.limit}
                spent={budget.spent}
                currencySymbol={currencySymbol}
                onDelete={() => handleDelete(budget.id)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState
              icon={<Target size={24} />}
              title="No budgets set"
              description="Create monthly budgets to track your spending by category."
              action={
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary"
                >
                  <Plus size={16} />
                  Add Budget
                </button>
              }
            />
          </Card>
        )}
      </div>

      {/* FAB */}
      {availableCategories.length > 0 && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-24 right-5 md:bottom-8 md:right-8 z-30 w-14 h-14 rounded-2xl bg-charcoal text-white flex items-center justify-center shadow-lg hover:bg-charcoal/90 active:scale-95 transition-all"
          aria-label="Add budget"
        >
          <Plus size={24} />
        </button>
      )}

      {/* Add Budget Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] bg-charcoal/30 backdrop-blur-sm"
              onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[95] bg-white rounded-t-2xl md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl md:max-w-md md:w-full"
              style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
            >
              <div className="flex justify-center pt-3 md:hidden">
                <div className="w-10 h-1 rounded-full bg-pale-stone" />
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <h2 className="text-lg font-semibold text-charcoal">
                  Add Budget
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1.5 rounded-lg hover:bg-ivory transition-colors text-warm-gray"
                >
                  <X size={18} />
                </button>
              </div>
              <hr className="divider" />
              <form onSubmit={handleAdd} className="px-5 py-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-warm-gray mb-1.5 uppercase tracking-wide">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-pale-stone bg-white text-charcoal text-sm focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select a category</option>
                    {availableCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-warm-gray mb-1.5 uppercase tracking-wide">
                    Monthly Limit
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={newLimit}
                    onChange={(e) => setNewLimit(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-pale-stone bg-white text-charcoal text-lg font-semibold placeholder:text-warm-gray/40 focus:outline-none focus:border-gold transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newCategory || !newLimit}
                  className="btn btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed py-3.5"
                >
                  Create Budget
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
