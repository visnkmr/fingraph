"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings as SettingsIcon } from "lucide-react";
import { useSettings } from "@/context/settings-context";

const currencies = [
  { code: "INR", name: "Indian Rupee (₹)", symbol: "₹" },
  { code: "USD", name: "US Dollar ($)", symbol: "$" },
  { code: "EUR", name: "Euro (€)", symbol: "€" },
  { code: "GBP", name: "British Pound (£)", symbol: "£" },
  { code: "JPY", name: "Japanese Yen (¥)", symbol: "¥" },
  { code: "AUD", name: "Australian Dollar (A$)", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar (C$)", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc (CHF)", symbol: "CHF" },
  { code: "CNY", name: "Chinese Yuan (¥)", symbol: "¥" },
  { code: "SEK", name: "Swedish Krona (kr)", symbol: "kr" },
];

export function SettingsDialog() {
  const { currency, setCurrency } = useSettings();
  const [open, setOpen] = useState(false);
  const [tempCurrency, setTempCurrency] = useState(currency);

  const handleSave = () => {
    setCurrency(tempCurrency);
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset temp value when closing without saving
      setTempCurrency(currency);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <SettingsIcon className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your financial tracker preferences
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="currency" className="text-right">
              Currency
            </label>
            <Select value={tempCurrency} onValueChange={setTempCurrency}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    {curr.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}