"use client";

import * as LucideIcons from "lucide-react";
import { getCategoryById } from "@/app/lib/categories";
import { formatCurrency, formatDate } from "@/app/lib/utils";
import type { Transaction } from "@/app/lib/types";

interface TransactionItemProps {
  transaction: Transaction;
  currencySymbol: string;
  onDelete?: (id: string) => void;
}

export default function TransactionItem({
  transaction,
  currencySymbol,
  onDelete,
}: TransactionItemProps) {
  const category = getCategoryById(transaction.category);
  const iconName = category?.icon ?? "MoreHorizontal";

  // Dynamically get the icon component
  const Icon =
    (LucideIcons as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[
      iconName
    ] ?? LucideIcons.MoreHorizontal;

  const isIncome = transaction.type === "income";

  return (
    <div className="flex items-center gap-3 py-3 group">
      {/* Category icon */}
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 ${
          isIncome ? "bg-gold-tint" : "bg-ivory"
        }`}
      >
        <Icon size={18} className={isIncome ? "text-gold" : "text-warm-gray"} />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-charcoal truncate">
          {transaction.description || category?.label || "Transaction"}
        </p>
        <p className="text-xs text-warm-gray">
          {category?.label} · {formatDate(transaction.date)}
        </p>
      </div>

      {/* Amount */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <p
          className={`text-sm font-semibold tabular-nums ${
            isIncome ? "text-charcoal" : "text-warm-gray"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount, currencySymbol)}
        </p>

        {/* Delete button (visible on hover / always on touch) */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(transaction.id);
            }}
            className="opacity-0 group-hover:opacity-100 md:opacity-0 p-1 rounded-lg hover:bg-ivory transition-all text-warm-gray hover:text-error"
            aria-label="Delete transaction"
          >
            <LucideIcons.X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
