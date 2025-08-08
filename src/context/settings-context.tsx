"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface SettingsContextType {
  currency: string;
  setCurrency: (currency: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<string>("INR");

  // Load currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency");
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  // Save currency to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  return (
    <SettingsContext.Provider value={{ currency, setCurrency }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}