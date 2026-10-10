"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, ArrowLeftRight } from "lucide-react";
import TransactionItem from "@/app/components/TransactionItem";
import TransactionForm from "@/app/components/TransactionForm";
import Card from "@/app/components/Card";
import EmptyState from "@/app/components/EmptyState";
import PageTransition from "@/app/components/PageTransition";
import { StaggerContainer, StaggerItem } from "@/app/components/PageTransition";
import { getTransactions, getProfile, deleteTransaction } from "@/app/lib/store";
import { ALL_CATEGORIES } from "@/app/lib/categories";
import type { Transaction, TransactionType } from "@/app/lib/types";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | TransactionType>("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const refresh = useCallback(() => {
    setTransactions(getTransactions());
    setCurrencySymbol(getProfile().currencySymbol);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function handleDelete(id: string) {
    deleteTransaction(id);
    refresh();
  }

  const filtered = transactions.filter((tx) => {
    if (filterType !== "all" && tx.type !== filterType) return false;
    if (filterCategory !== "all" && tx.category !== filterCategory) return false;
    if (
      search &&
      !tx.description.toLowerCase().includes(search.toLowerCase()) &&
      !(
        ALL_CATEGORIES.find((c) => c.id === tx.category)
          ?.label.toLowerCase()
          .includes(search.toLowerCase())
      )
    )
      return false;
    return true;
  });

  return (
    <PageTransition>
      <div className="space-y-4 pb-4">
        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-gray"
          />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-pale-stone bg-white text-sm text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          {(["all", "expense", "income"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterType === type
                  ? "bg-charcoal text-white"
                  : "bg-white text-warm-gray border border-pale-stone hover:border-warm-gray"
              }`}
            >
              {type === "all" ? "All" : type === "expense" ? "Expenses" : "Income"}
            </button>
          ))}

          {filterCategory !== "all" && (
            <button
              onClick={() => setFilterCategory("all")}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-gold-tint text-charcoal border border-gold/30"
            >
              {ALL_CATEGORIES.find((c) => c.id === filterCategory)?.label} ✕
            </button>
          )}
        </div>

        {/* Transaction List */}
        <Card padding="sm">
          <div className="px-3 pt-2 pb-1">
            <p className="text-xs text-warm-gray">
              {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          {filtered.length > 0 ? (
            <StaggerContainer className="px-3">
              {filtered.map((tx, i) => (
                <StaggerItem key={tx.id}>
                  <TransactionItem
                    transaction={tx}
                    currencySymbol={currencySymbol}
                    onDelete={handleDelete}
                  />
                  {i < filtered.length - 1 && <hr className="divider" />}
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <EmptyState
              icon={<ArrowLeftRight size={24} />}
              title={search ? "No matches" : "No transactions yet"}
              description={
                search
                  ? "Try a different search term or clear filters."
                  : "Tap the + button to add your first transaction."
              }
            />
          )}
        </Card>
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-24 right-5 md:bottom-8 md:right-8 z-30 w-14 h-14 rounded-2xl bg-charcoal text-white flex items-center justify-center shadow-lg hover:bg-charcoal/90 active:scale-95 transition-all"
        aria-label="Add transaction"
      >
        <Plus size={24} />
      </button>

      <TransactionForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSaved={refresh}
      />
    </PageTransition>
  );
}
