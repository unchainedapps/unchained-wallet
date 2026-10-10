"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface BalanceCardProps {
  balance: number;
  income: number;
  expenses: number;
  currencySymbol: string;
}

function formatAmount(amount: number, symbol: string): string {
  return `${symbol}${Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function BalanceCard({
  balance,
  income,
  expenses,
  currencySymbol,
}: BalanceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="card p-6 relative overflow-hidden"
    >
      {/* Subtle gold accent line at top */}
      <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <p className="text-xs font-medium text-warm-gray uppercase tracking-wider mb-1">
        Total Balance
      </p>
      <motion.p
        key={balance}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-3xl font-semibold tracking-tight ${
          balance >= 0 ? "text-charcoal" : "text-error"
        }`}
      >
        {balance < 0 ? "-" : ""}
        {formatAmount(balance, currencySymbol)}
      </motion.p>

      <hr className="divider my-4" />

      <div className="flex gap-4">
        {/* Income */}
        <div className="flex-1 flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-ivory">
            <TrendingUp size={16} className="text-charcoal" />
          </div>
          <div>
            <p className="text-[11px] text-warm-gray">Income</p>
            <p className="text-sm font-medium text-charcoal">
              {formatAmount(income, currencySymbol)}
            </p>
          </div>
        </div>

        {/* Expenses */}
        <div className="flex-1 flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-ivory">
            <TrendingDown size={16} className="text-warm-gray" />
          </div>
          <div>
            <p className="text-[11px] text-warm-gray">Expenses</p>
            <p className="text-sm font-medium text-charcoal">
              {formatAmount(expenses, currencySymbol)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
