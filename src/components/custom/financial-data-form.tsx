
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChangeEvent, useState } from "react";

const formSchema = z.object({
  date: z.string(),
  price: z.number().min(0, "Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  retailer: z.string().min(1, "Retailer is required"),
});

export function FinancialDataForm({
  onAddData,
}: {
  onAddData: (data: z.infer<typeof formSchema>) => void;
}) {
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isCustomRetailer, setIsCustomRetailer] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [customRetailer, setCustomRetailer] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      price: 0,
      category: "shopping",
      retailer: "offline",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle custom category
    if (isCustomCategory && customCategory.trim()) {
      values.category = customCategory.trim();
    }
    
    // Handle custom retailer
    if (isCustomRetailer && customRetailer.trim()) {
      values.retailer = customRetailer.trim();
    }
    
    onAddData(values);
    form.reset({
      date: new Date().toISOString().split("T")[0],
      price: 0,
      category: "shopping",
      retailer: "offline",
    });
    setIsCustomCategory(false);
    setIsCustomRetailer(false);
    setCustomCategory("");
    setCustomRetailer("");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0"
                  {...field} 
                  onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <div className="space-y-2">
                <Select 
                  onValueChange={(value) => {
                    if (value === "custom") {
                      setIsCustomCategory(true);
                      field.onChange("");
                    } else {
                      setIsCustomCategory(false);
                      field.onChange(value);
                    }
                  }} 
                  value={isCustomCategory ? "custom" : field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="custom">Other (Specify)</SelectItem>
                  </SelectContent>
                </Select>
                {isCustomCategory && (
                  <Input 
                    placeholder="Enter custom category" 
                    value={customCategory}
                    onChange={(e) => {
                      setCustomCategory(e.target.value);
                      field.onChange(e.target.value);
                    }}
                  />
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="retailer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Retailer</FormLabel>
              <div className="space-y-2">
                <Select 
                  onValueChange={(value) => {
                    if (value === "custom") {
                      setIsCustomRetailer(true);
                      field.onChange("");
                    } else {
                      setIsCustomRetailer(false);
                      field.onChange(value);
                    }
                  }} 
                  value={isCustomRetailer ? "custom" : field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a retailer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="grocery">Grocery</SelectItem>
                    <SelectItem value="gas">Gas</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="custom">Other (Specify)</SelectItem>
                  </SelectContent>
                </Select>
                {isCustomRetailer && (
                  <Input 
                    placeholder="Enter custom retailer" 
                    value={customRetailer}
                    onChange={(e) => {
                      setCustomRetailer(e.target.value);
                      field.onChange(e.target.value);
                    }}
                  />
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-end">
          <Button type="submit" className="w-full md:w-auto">Add Data</Button>
        </div>
      </form>
    </Form>
  );
}
