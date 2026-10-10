"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import BalanceCard from "./components/BalanceCard";
import TransactionItem from "./components/TransactionItem";
import TransactionForm from "./components/TransactionForm";
import Card from "./components/Card";
import EmptyState from "./components/EmptyState";
import PageTransition from "./components/PageTransition";
import {
  getTransactions,
  getMonthlyStats,
  getTotalBalance,
  getProfile,
  deleteTransaction,
} from "./lib/store";
import { ArrowLeftRight } from "lucide-react";
import type { Transaction, MonthlyStats } from "./lib/types";
import Link from "next/link";

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<MonthlyStats>({
    income: 0,
    expenses: 0,
    balance: 0,
    transactionCount: 0,
  });
  const [totalBalance, setTotalBalance] = useState(0);
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [showForm, setShowForm] = useState(false);

  const refresh = useCallback(() => {
    setTransactions(getTransactions().slice(0, 5));
    setStats(getMonthlyStats());
    setTotalBalance(getTotalBalance());
    setCurrencySymbol(getProfile().currencySymbol);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function handleDelete(id: string) {
    deleteTransaction(id);
    refresh();
  }

  return (
    <PageTransition>
      <div className="space-y-4 pb-4">
        {/* Balance Card */}
        <BalanceCard
          balance={totalBalance}
          income={stats.income}
          expenses={stats.expenses}
          currencySymbol={currencySymbol}
        />

        {/* Recent Transactions */}
        <Card padding="sm">
          <div className="flex items-center justify-between px-3 pt-2 pb-1">
            <h2 className="text-sm font-medium text-charcoal">
              Recent Transactions
            </h2>
            <Link
              href="/transactions"
              className="text-xs text-warm-gray hover:text-charcoal transition-colors"
            >
              See all
            </Link>
          </div>

          {transactions.length > 0 ? (
            <div className="px-3">
              {transactions.map((tx, i) => (
                <div key={tx.id}>
                  <TransactionItem
                    transaction={tx}
                    currencySymbol={currencySymbol}
                    onDelete={handleDelete}
                  />
                  {i < transactions.length - 1 && <hr className="divider" />}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<ArrowLeftRight size={24} />}
              title="No transactions yet"
              description="Tap the + button to add your first income or expense."
            />
          )}
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card padding="md">
            <p className="text-xs text-warm-gray mb-0.5">This Month</p>
            <p className="text-lg font-semibold text-charcoal tabular-nums">
              {stats.transactionCount}
            </p>
            <p className="text-[11px] text-warm-gray">transactions</p>
          </Card>
          <Card padding="md">
            <p className="text-xs text-warm-gray mb-0.5">Monthly Net</p>
            <p
              className={`text-lg font-semibold tabular-nums ${
                stats.balance >= 0 ? "text-charcoal" : "text-error"
              }`}
            >
              {stats.balance >= 0 ? "+" : "-"}
              {currencySymbol}
              {Math.abs(stats.balance).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-[11px] text-warm-gray">income − expenses</p>
          </Card>
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-24 right-5 md:bottom-8 md:right-8 z-30 w-14 h-14 rounded-2xl bg-charcoal text-white flex items-center justify-center shadow-lg hover:bg-charcoal/90 active:scale-95 transition-all"
        aria-label="Add transaction"
      >
        <Plus size={24} />
      </button>

      {/* Transaction Form Modal */}
      <TransactionForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSaved={refresh}
      />
    </PageTransition>
  );
}
