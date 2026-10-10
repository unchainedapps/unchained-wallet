"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-ivory mb-4 text-warm-gray">
        {icon}
      </div>
      <h3 className="text-base font-medium text-charcoal mb-1">{title}</h3>
      <p className="text-sm text-warm-gray max-w-[240px] mb-6">
        {description}
      </p>
      {action}
    </motion.div>
  );
}
