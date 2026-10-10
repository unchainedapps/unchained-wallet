"use client";

import { getCategoryLabel } from "@/app/lib/categories";
import { formatCurrency, percentage } from "@/app/lib/utils";
import { motion } from "framer-motion";

interface BudgetCardProps {
  category: string;
  limit: number;
  spent: number;
  currencySymbol: string;
  onDelete?: () => void;
}

export default function BudgetCard({
  category,
  limit,
  spent,
  currencySymbol,
  onDelete,
}: BudgetCardProps) {
  const pct = percentage(spent, limit);
  const remaining = limit - spent;
  const isOver = spent > limit;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="card p-4 group"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-charcoal">
          {getCategoryLabel(category)}
        </p>
        <div className="flex items-center gap-2">
          <p className="text-xs text-warm-gray tabular-nums">
            {formatCurrency(spent, currencySymbol)} /{" "}
            {formatCurrency(limit, currencySymbol)}
          </p>
          {onDelete && (
            <button
              onClick={onDelete}
              className="opacity-0 group-hover:opacity-100 text-xs text-warm-gray hover:text-error transition-all"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-ivory overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(pct, 100)}%` }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className={`h-full rounded-full ${
            isOver ? "bg-error" : pct > 80 ? "bg-gold" : "bg-charcoal"
          }`}
        />
      </div>

      {/* Status */}
      <p
        className={`text-xs mt-1.5 ${isOver ? "text-error" : "text-warm-gray"}`}
      >
        {isOver
          ? `Over budget by ${formatCurrency(Math.abs(remaining), currencySymbol)}`
          : `${formatCurrency(remaining, currencySymbol)} remaining`}
      </p>
    </motion.div>
  );
}
