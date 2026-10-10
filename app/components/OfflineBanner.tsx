"use client";

import { useOffline } from "next/offline";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff } from "lucide-react";

export default function OfflineBanner() {
  const isOffline = useOffline();

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          role="status"
          className="overflow-hidden"
        >
          <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gold-tint text-charcoal text-sm">
            <WifiOff size={14} />
            <span>You&apos;re offline. Your data is saved locally.</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
