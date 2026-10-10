"use client";

import { useState, useEffect, useCallback } from "react";
import Navigation from "./Navigation";
import Header from "./Header";
import OfflineBanner from "./OfflineBanner";
import Onboarding from "./Onboarding";
import { isOnboardingComplete, getProfile } from "@/app/lib/store";
import { getGreeting } from "@/app/lib/utils";
import { usePathname } from "next/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userName, setUserName] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    if (!isOnboardingComplete()) {
      setShowOnboarding(true);
    } else {
      setUserName(getProfile().name);
    }
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    setShowOnboarding(false);
    setUserName(getProfile().name);
  }, []);

  // Don't render until client-side to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-ivory">
        <div className="w-8 h-8 rounded-full border-2 border-pale-stone border-t-gold animate-spin" />
      </div>
    );
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const greeting = getGreeting();
  const isDashboard = pathname === "/";

  return (
    <div className="flex min-h-screen bg-ivory">
      {/* Desktop sidebar spacer */}
      <div className="hidden md:block w-64 flex-shrink-0" />

      {/* Navigation */}
      <Navigation />

      {/* Main content area */}
      <main className="flex-1 flex flex-col min-w-0">
        <OfflineBanner />
        <Header
          greeting={isDashboard ? greeting : undefined}
          userName={isDashboard ? userName : undefined}
        />
        <div className="flex-1 px-5 pb-safe md:px-8 md:pb-8">
          <div className="max-w-2xl mx-auto w-full">{children}</div>
        </div>
      </main>
    </div>
  );
}
