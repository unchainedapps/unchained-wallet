"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Target,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/budgets", label: "Budgets", icon: Target },
  { href: "/analytics", label: "Analytics", icon: PieChart },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* ─── Mobile Bottom Navigation ─── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-pale-stone md:hidden">
        <div
          className="flex items-center justify-around px-2"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center gap-0.5 py-2 px-3 min-w-[56px]"
              >
                <div className="relative">
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2 : 1.5}
                    className={
                      isActive ? "text-charcoal" : "text-warm-gray"
                    }
                  />
                  {isActive && (
                    <motion.div
                      layoutId="nav-dot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </div>
                <span
                  className={`text-[10px] leading-tight ${
                    isActive
                      ? "text-charcoal font-medium"
                      : "text-warm-gray"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ─── Desktop Sidebar ─── */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 z-50 w-64 flex-col bg-white border-r border-pale-stone">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6">
          <Image
            src="/unchained-wallet-matching-chain-logo.png"
            alt="Unchained Wallet"
            width={36}
            height={36}
            className="flex-shrink-0"
          />
          <div>
            <h1 className="text-sm font-semibold text-charcoal leading-tight">
              Unchained
            </h1>
            <p className="text-[11px] text-warm-gray leading-tight">Wallet</p>
          </div>
        </div>

        <hr className="divider mx-4" />

        {/* Nav Links */}
        <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  isActive
                    ? "bg-ivory text-charcoal font-medium"
                    : "text-warm-gray hover:text-charcoal hover:bg-ivory/50"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gold"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-pale-stone">
          <p className="text-[11px] text-warm-gray">
            Own your tools.
            <br />
            Keep your freedom.
          </p>
        </div>
      </aside>
    </>
  );
}
