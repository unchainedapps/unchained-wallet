"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/transactions": "Transactions",
  "/budgets": "Budgets",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

interface HeaderProps {
  greeting?: string;
  userName?: string;
}

export default function Header({ greeting, userName }: HeaderProps) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Unchained Wallet";
  const isDashboard = pathname === "/";

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-md">
      <div className="flex items-center justify-between px-5 py-4 md:px-8">
        {/* Left: Title or Greeting */}
        <div className="flex-1 min-w-0">
          {isDashboard && greeting ? (
            <div>
              <p className="text-sm text-warm-gray">{greeting}</p>
              <h1 className="text-xl font-semibold text-charcoal truncate">
                {userName || "Welcome back"}
              </h1>
            </div>
          ) : (
            <h1 className="text-xl font-semibold text-charcoal">{title}</h1>
          )}
        </div>

        {/* Right: Logo (mobile only) */}
        <div className="md:hidden flex-shrink-0 ml-3">
          <Image
            src="/unchained-wallet-matching-chain-logo.png"
            alt="Unchained Wallet"
            width={32}
            height={32}
            className="rounded-lg"
          />
        </div>
      </div>
    </header>
  );
}
