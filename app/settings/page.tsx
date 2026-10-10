"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Download, Upload, Trash2, Info, ChevronRight } from "lucide-react";
import Card from "@/app/components/Card";
import PageTransition from "@/app/components/PageTransition";
import {
  getProfile,
  updateProfile,
  exportData,
  importData,
  clearAllData,
} from "@/app/lib/store";

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

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(() => {
    const profile = getProfile();
    setName(profile.name);
    setCurrency(profile.currency);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function handleNameBlur() {
    if (name.trim()) {
      updateProfile({ name: name.trim() });
    }
  }

  function handleCurrencyChange(code: string) {
    const selected = CURRENCIES.find((c) => c.code === code);
    if (selected) {
      setCurrency(code);
      updateProfile({ currency: code, currencySymbol: selected.symbol });
    }
  }

  function handleExport() {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `unchained-wallet-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const success = importData(reader.result as string);
      setImportStatus(success ? "Data imported successfully!" : "Invalid file format.");
      if (success) refresh();
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleClear() {
    clearAllData();
    window.location.reload();
  }

  return (
    <PageTransition>
      <div className="space-y-4 pb-4">
        {/* Profile */}
        <Card padding="lg">
          <h2 className="text-xs font-medium text-warm-gray uppercase tracking-wider mb-3">
            Profile
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-warm-gray mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleNameBlur}
                className="w-full px-4 py-2.5 rounded-xl border border-pale-stone bg-white text-sm text-charcoal focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-warm-gray mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-pale-stone bg-white text-sm text-charcoal focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} — {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Data */}
        <Card padding="lg">
          <h2 className="text-xs font-medium text-warm-gray uppercase tracking-wider mb-3">
            Data
          </h2>
          <div className="space-y-1">
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-ivory transition-colors text-left"
            >
              <Download size={18} className="text-warm-gray flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-charcoal">Export Data</p>
                <p className="text-xs text-warm-gray">
                  Download your data as JSON
                </p>
              </div>
              <ChevronRight size={16} className="text-warm-gray" />
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-ivory transition-colors text-left"
            >
              <Upload size={18} className="text-warm-gray flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-charcoal">Import Data</p>
                <p className="text-xs text-warm-gray">
                  Restore from a JSON backup
                </p>
              </div>
              <ChevronRight size={16} className="text-warm-gray" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />

            {importStatus && (
              <p className="text-xs text-gold px-3 py-2">{importStatus}</p>
            )}

            <hr className="divider my-2" />

            {!showConfirmClear ? (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-ivory transition-colors text-left"
              >
                <Trash2 size={18} className="text-error flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-error">Clear All Data</p>
                  <p className="text-xs text-warm-gray">
                    Permanently delete everything
                  </p>
                </div>
              </button>
            ) : (
              <div className="px-3 py-3 rounded-xl bg-ivory">
                <p className="text-sm text-charcoal mb-2">
                  Are you sure? This cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button onClick={handleClear} className="btn btn-danger text-xs py-2 px-4">
                    Yes, Delete All
                  </button>
                  <button
                    onClick={() => setShowConfirmClear(false)}
                    className="btn btn-secondary text-xs py-2 px-4"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* About */}
        <Card padding="lg">
          <h2 className="text-xs font-medium text-warm-gray uppercase tracking-wider mb-3">
            About
          </h2>
          <div className="flex items-start gap-4">
            <Image
              src="/unchained-wallet-matching-chain-logo.png"
              alt="Unchained Wallet"
              width={48}
              height={48}
              className="rounded-xl flex-shrink-0"
            />
            <div>
              <p className="text-sm font-medium text-charcoal">
                Unchained Wallet
              </p>
              <p className="text-xs text-warm-gray mt-0.5">
                Version 0.1.0 · Open Source
              </p>
              <p className="text-xs text-warm-gray mt-2 leading-relaxed">
                Free, private, and yours. All data stays on your device.
                No server, no tracking, no account required.
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs text-gold">
                <Info size={12} />
                <span>Own your tools. Keep your freedom.</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
