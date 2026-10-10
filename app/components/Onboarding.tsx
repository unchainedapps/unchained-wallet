"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Wallet, Shield, Smartphone } from "lucide-react";
import { updateProfile } from "@/app/lib/store";

interface OnboardingProps {
  onComplete: () => void;
}

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen" },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "BRL", symbol: "R$", label: "Brazilian Real" },
  { code: "SAR", symbol: "﷼", label: "Saudi Riyal" },
  { code: "AED", symbol: "د.إ", label: "UAE Dirham" },
  { code: "SDG", symbol: "ج.س", label: "Sudanese Pound" },
];

const STEPS = [
  {
    icon: <Wallet size={32} className="text-gold" />,
    title: "Track Your Money",
    description:
      "Log income and expenses effortlessly. Understand exactly where your money goes.",
  },
  {
    icon: <Shield size={32} className="text-gold" />,
    title: "100% Private",
    description:
      "Your data never leaves your device. No server, no tracking, no account required.",
  },
  {
    icon: <Smartphone size={32} className="text-gold" />,
    title: "Works Everywhere",
    description:
      "Install on your phone or desktop. Works offline, syncs with nothing but you.",
  },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("USD");

  const totalSteps = STEPS.length + 1; // intro steps + setup step
  const isSetupStep = step === STEPS.length;

  function handleNext() {
    if (step < STEPS.length) {
      setStep(step + 1);
    }
  }

  function handleFinish() {
    const selected = CURRENCIES.find((c) => c.code === currency);
    updateProfile({
      name: name.trim() || "Friend",
      currency,
      currencySymbol: selected?.symbol ?? "$",
      onboardingComplete: true,
    });
    onComplete();
  }

  return (
    <div className="fixed inset-0 z-[100] bg-ivory flex flex-col items-center justify-center px-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full max-w-sm flex flex-col items-center text-center"
        >
          {!isSetupStep ? (
            <>
              {/* ─── Logo ─── */}
              {step === 0 && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="mb-8"
                >
                  <Image
                    src="/unchained-wallet-matching-chain-logo.png"
                    alt="Unchained Wallet"
                    width={80}
                    height={80}
                  />
                </motion.div>
              )}

              {/* ─── Icon ─── */}
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-tint mb-6">
                {STEPS[step].icon}
              </div>

              {/* ─── Content ─── */}
              <h2 className="text-2xl font-semibold text-charcoal mb-2">
                {STEPS[step].title}
              </h2>
              <p className="text-warm-gray text-sm leading-relaxed mb-10 max-w-[280px]">
                {STEPS[step].description}
              </p>

              {/* ─── Next Button ─── */}
              <button onClick={handleNext} className="btn btn-primary w-full">
                Continue
                <ArrowRight size={16} />
              </button>
            </>
          ) : (
            <>
              {/* ─── Setup Step ─── */}
              <h2 className="text-2xl font-semibold text-charcoal mb-2">
                Let&apos;s set up
              </h2>
              <p className="text-warm-gray text-sm mb-8">
                Just two quick things, then you&apos;re in.
              </p>

              {/* Name */}
              <div className="w-full mb-4">
                <label className="block text-xs font-medium text-warm-gray mb-1.5 text-left uppercase tracking-wide">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="What should we call you?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-pale-stone bg-white text-charcoal text-sm placeholder:text-warm-gray/60 focus:outline-none focus:border-gold transition-colors"
                  autoFocus
                />
              </div>

              {/* Currency */}
              <div className="w-full mb-8">
                <label className="block text-xs font-medium text-warm-gray mb-1.5 text-left uppercase tracking-wide">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-pale-stone bg-white text-charcoal text-sm focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.symbol} — {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Finish */}
              <button
                onClick={handleFinish}
                className="btn btn-gold w-full"
              >
                Start Tracking
                <ArrowRight size={16} />
              </button>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ─── Progress Dots ─── */}
      <div className="flex gap-2 mt-10">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === step
                ? "w-6 bg-gold"
                : i < step
                  ? "w-1.5 bg-gold/40"
                  : "w-1.5 bg-pale-stone"
            }`}
          />
        ))}
      </div>

      {/* ─── Skip (only on intro steps) ─── */}
      {!isSetupStep && (
        <button
          onClick={() => setStep(STEPS.length)}
          className="mt-4 text-xs text-warm-gray hover:text-charcoal transition-colors"
        >
          Skip intro
        </button>
      )}
    </div>
  );
}
