"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/app/lib/categories";
import { addTransaction } from "@/app/lib/store";
import { todayISO } from "@/app/lib/utils";
import type { TransactionType } from "@/app/lib/types";

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  defaultType?: TransactionType;
}

export default function TransactionForm({
  isOpen,
  onClose,
  onSaved,
  defaultType = "expense",
}: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>(defaultType);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(todayISO());

  const categories =
    type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || !category) return;

    addTransaction({
      type,
      amount: parsedAmount,
      category,
      description: description.trim(),
      date: new Date(date).toISOString(),
    });

    // Reset
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(todayISO());
    onSaved();
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[90] bg-charcoal/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[95] bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl md:max-w-md md:w-full"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
          >
            {/* Handle bar (mobile) */}
            <div className="flex justify-center pt-3 md:hidden">
              <div className="w-10 h-1 rounded-full bg-pale-stone" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4">
              <h2 className="text-lg font-semibold text-charcoal">
                Add Transaction
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-ivory transition-colors text-warm-gray"
              >
                <X size={18} />
              </button>
            </div>

            <hr className="divider" />

            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
              {/* Type Toggle */}
              <div className="flex gap-1 p-1 rounded-xl bg-ivory">
                {(["expense", "income"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setType(t);
                      setCategory("");
                    }}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                      type === t
                        ? "bg-white text-charcoal shadow-sm"
                        : "text-warm-gray"
                    }`}
                  >
                    {t === "expense" ? "Expense" : "Income"}
                  </button>
                ))}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-medium text-warm-gray mb-1.5 uppercase tracking-wide">
                  Amount
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-pale-stone bg-white text-charcoal text-lg font-semibold placeholder:text-warm-gray/40 focus:outline-none focus:border-gold transition-colors"
                  required
                  autoFocus
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-warm-gray mb-1.5 uppercase tracking-wide">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl text-xs transition-all ${
                        category === cat.id
                          ? "bg-gold-tint border border-gold text-charcoal font-medium"
                          : "bg-ivory border border-transparent text-warm-gray hover:border-pale-stone"
                      }`}
                    >
                      <span className="text-[11px] text-center leading-tight truncate w-full">
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-warm-gray mb-1.5 uppercase tracking-wide">
                  Description
                  <span className="text-warm-gray/50 font-normal normal-case">
                    {" "}
                    (optional)
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Coffee with friends..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-pale-stone bg-white text-charcoal text-sm placeholder:text-warm-gray/40 focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-medium text-warm-gray mb-1.5 uppercase tracking-wide">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-pale-stone bg-white text-charcoal text-sm focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!amount || !category}
                className="btn btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed py-3.5"
              >
                {type === "expense" ? "Add Expense" : "Add Income"}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
