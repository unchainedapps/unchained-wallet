"use client";

import { useState, useEffect, useCallback } from "react";
import { PieChart as PieChartIcon } from "lucide-react";
import Card from "@/app/components/Card";
import EmptyState from "@/app/components/EmptyState";
import PageTransition from "@/app/components/PageTransition";
import { motion } from "framer-motion";
import {
  getSpendingByCategory,
  getProfile,
  getMonthlyStats,
  getTransactions,
} from "@/app/lib/store";
import { getCategoryLabel } from "@/app/lib/categories";
import { formatCurrency, formatMonthYear } from "@/app/lib/utils";

// Muted brand-consistent colors for the donut chart segments
const CHART_COLORS = [
  "#20201F", // charcoal
  "#C4A168", // gold
  "#77736C", // warm gray
  "#E7E1D7", // pale stone
  "#B85C5C", // error red
  "#9C8B7A", // warm mid
  "#A39585", // soft brown
  "#C4B5A0", // light warm
];

export default function AnalyticsPage() {
  const [spending, setSpending] = useState<{ category: string; total: number }[]>([]);
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [stats, setStats] = useState({ income: 0, expenses: 0, balance: 0, transactionCount: 0 });
  const [monthlyData, setMonthlyData] = useState<{ month: string; expenses: number; income: number }[]>([]);

  const refresh = useCallback(() => {
    setSpending(getSpendingByCategory());
    setCurrencySymbol(getProfile().currencySymbol);
    setStats(getMonthlyStats());

    // Build last 6 months of data
    const txs = getTransactions();
    const months: Map<string, { expenses: number; income: number }> = new Map();
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months.set(key, { expenses: 0, income: 0 });
    }
    for (const tx of txs) {
      const d = new Date(tx.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (months.has(key)) {
        const entry = months.get(key)!;
        if (tx.type === "expense") entry.expenses += tx.amount;
        else entry.income += tx.amount;
      }
    }
    setMonthlyData(
      Array.from(months.entries()).map(([month, data]) => ({
        month,
        ...data,
      }))
    );
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const totalSpending = spending.reduce((s, item) => s + item.total, 0);
  const maxMonthly = Math.max(
    ...monthlyData.map((m) => Math.max(m.expenses, m.income)),
    1
  );

  return (
    <PageTransition>
      <div className="space-y-4 pb-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          <Card padding="md">
            <p className="text-[11px] text-warm-gray">Income</p>
            <p className="text-base font-semibold text-charcoal tabular-nums">
              {formatCurrency(stats.income, currencySymbol)}
            </p>
          </Card>
          <Card padding="md">
            <p className="text-[11px] text-warm-gray">Expenses</p>
            <p className="text-base font-semibold text-charcoal tabular-nums">
              {formatCurrency(stats.expenses, currencySymbol)}
            </p>
          </Card>
          <Card padding="md">
            <p className="text-[11px] text-warm-gray">Net</p>
            <p
              className={`text-base font-semibold tabular-nums ${
                stats.balance >= 0 ? "text-charcoal" : "text-error"
              }`}
            >
              {stats.balance >= 0 ? "+" : ""}
              {formatCurrency(stats.balance, currencySymbol)}
            </p>
          </Card>
        </div>

        {/* Spending by Category */}
        <Card padding="lg">
          <h2 className="text-sm font-medium text-charcoal mb-4">
            Spending by Category
          </h2>
          {spending.length > 0 ? (
            <>
              {/* Donut Chart (CSS) */}
              <div className="flex justify-center mb-6">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {(() => {
                      let offset = 0;
                      return spending.map((item, i) => {
                        const pct = (item.total / totalSpending) * 100;
                        const circumference = Math.PI * 70; // 2 * pi * r (r=35)
                        const dashLength = (pct / 100) * circumference;
                        const gapLength = circumference - dashLength;
                        const dashOffset = -(offset / 100) * circumference;
                        offset += pct;
                        return (
                          <motion.circle
                            key={item.category}
                            cx="50"
                            cy="50"
                            r="35"
                            fill="none"
                            stroke={CHART_COLORS[i % CHART_COLORS.length]}
                            strokeWidth="12"
                            strokeDasharray={`${dashLength} ${gapLength}`}
                            strokeDashoffset={dashOffset}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.1, duration: 0.4 }}
                          />
                        );
                      });
                    })()}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-lg font-semibold text-charcoal">
                      {formatCurrency(totalSpending, currencySymbol)}
                    </p>
                    <p className="text-[10px] text-warm-gray">total</p>
                  </div>
                </div>
              </div>

              {/* Category List */}
              <div className="space-y-2.5">
                {spending.map((item, i) => {
                  const pct = totalSpending > 0 ? (item.total / totalSpending) * 100 : 0;
                  return (
                    <div key={item.category} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            CHART_COLORS[i % CHART_COLORS.length],
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-charcoal truncate">
                            {getCategoryLabel(item.category)}
                          </p>
                          <p className="text-sm font-medium text-charcoal tabular-nums ml-2">
                            {formatCurrency(item.total, currencySymbol)}
                          </p>
                        </div>
                        <div className="w-full h-1 rounded-full bg-ivory mt-1 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                            className="h-full rounded-full"
                            style={{
                              backgroundColor:
                                CHART_COLORS[i % CHART_COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <EmptyState
              icon={<PieChartIcon size={24} />}
              title="No spending data"
              description="Add some expenses to see your spending breakdown."
            />
          )}
        </Card>

        {/* Monthly Trend */}
        <Card padding="lg">
          <h2 className="text-sm font-medium text-charcoal mb-4">
            Last 6 Months
          </h2>
          {monthlyData.some((m) => m.expenses > 0 || m.income > 0) ? (
            <div className="flex items-end gap-2 h-32">
              {monthlyData.map((m, i) => {
                const expH = (m.expenses / maxMonthly) * 100;
                const incH = (m.income / maxMonthly) * 100;
                const label = new Date(m.month + "-01").toLocaleDateString(
                  "en-US",
                  { month: "short" }
                );
                return (
                  <div
                    key={m.month}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div className="w-full flex items-end gap-0.5 h-24">
                      {/* Income bar */}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${incH}%` }}
                        transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
                        className="flex-1 bg-charcoal rounded-t-sm min-h-[2px]"
                      />
                      {/* Expense bar */}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${expH}%` }}
                        transition={{ duration: 0.4, delay: i * 0.05 + 0.1, ease: "easeOut" }}
                        className="flex-1 bg-pale-stone rounded-t-sm min-h-[2px]"
                      />
                    </div>
                    <span className="text-[10px] text-warm-gray">{label}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-warm-gray text-center py-8">
              Not enough data yet
            </p>
          )}
          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-charcoal" />
              <span className="text-[11px] text-warm-gray">Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-pale-stone" />
              <span className="text-[11px] text-warm-gray">Expenses</span>
            </div>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
