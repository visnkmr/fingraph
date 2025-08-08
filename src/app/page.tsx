
"use client";

import { useState, useRef } from "react";
import { FinancialDataForm } from "@/components/custom/financial-data-form";
import { FinancialChart } from "@/components/custom/financial-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SettingsDialog } from "@/components/custom/settings-dialog";
import { useSettings } from "@/context/settings-context";

interface FinancialData {
  id: string;
  date: string;
  price: number;
  category: string;
  retailer: string;
}

// Currency formatting utility
const formatCurrency = (amount: number, currency: string): string => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch (e) {
    // Fallback if currency is not supported
    return `${currency} ${amount.toFixed(2)}`;
  }
};

// Function to calculate totals by category
const calculateCategoryTotals = (data: FinancialData[]) => {
  const totals: Record<string, number> = {};
  
  data.forEach(item => {
    if (totals[item.category]) {
      totals[item.category] += item.price;
    } else {
      totals[item.category] = item.price;
    }
  });
  
  return Object.entries(totals)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
};

// Function to calculate totals by retailer
const calculateRetailerTotals = (data: FinancialData[]) => {
  const totals: Record<string, number> = {};
  
  data.forEach(item => {
    if (totals[item.retailer]) {
      totals[item.retailer] += item.price;
    } else {
      totals[item.retailer] = item.price;
    }
  });
  
  return Object.entries(totals)
    .map(([retailer, total]) => ({ retailer, total }))
    .sort((a, b) => b.total - a.total);
};

export default function Home() {
  const { currency } = useSettings();
  const [data, setData] = useState<FinancialData[]>([]);
  const [timeView, setTimeView] = useState("daily");
  const [groupBy, setGroupBy] = useState("category");
  const [showTotals, setShowTotals] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);

  const addData = (newData: Omit<FinancialData, "id">) => {
    setData([
      ...data,
      {
        ...newData,
        id: Math.random().toString(36).substr(2, 9),
      },
    ]);
  };

  const exportToPDF = () => {
    const input = chartRef.current;
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save("financial-chart.pdf");
      });
    }
  };

  const filterData = (data: FinancialData[], view: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (view === "daily") {
      return data.filter(d => {
        const dataDate = new Date(d.date);
        const dataDay = new Date(dataDate.getFullYear(), dataDate.getMonth(), dataDate.getDate());
        return dataDay.getTime() === today.getTime();
      });
    }
    
    if (view === "weekly") {
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(today.getDate() - 7);
      return data.filter(d => {
        const dataDate = new Date(d.date);
        const dataDay = new Date(dataDate.getFullYear(), dataDate.getMonth(), dataDate.getDate());
        return dataDay >= oneWeekAgo && dataDay <= today;
      });
    }
    
    if (view === "monthly") {
      const oneMonthAgo = new Date(today);
      oneMonthAgo.setMonth(today.getMonth() - 1);
      return data.filter(d => {
        const dataDate = new Date(d.date);
        const dataDay = new Date(dataDate.getFullYear(), dataDate.getMonth(), dataDate.getDate());
        return dataDay >= oneMonthAgo && dataDay <= today;
      });
    }
    
    return data;
  };

  const filteredData = filterData(data, timeView);
  
  // Calculate totals for display
  const categoryTotals = calculateCategoryTotals(data);
  const retailerTotals = calculateRetailerTotals(data);
  const totalAmount = data.reduce((sum, item) => sum + item.price, 0);
  const filteredTotalAmount = filteredData.reduce((sum, item) => sum + item.price, 0);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-6xl">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold">Financial Tracker</CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowTotals(!showTotals)}
              >
                {showTotals ? "Hide" : "Show"} Totals
              </Button>
              <SettingsDialog />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="entry" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="entry">Data Entry</TabsTrigger>
                <TabsTrigger value="chart">Chart</TabsTrigger>
              </TabsList>
              <TabsContent value="entry">
                <div className="mt-4">
                  <FinancialDataForm onAddData={addData} />
                  
                  {showTotals && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <Card>
                          <CardContent className="pt-4">
                            <h3 className="text-lg font-semibold">Total Amount</h3>
                            <p className="text-2xl font-bold mt-2">{formatCurrency(totalAmount, currency)}</p>
                            <p className="text-sm text-muted-foreground mt-1">All time</p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="pt-4">
                            <h3 className="text-lg font-semibold">Filtered Total</h3>
                            <p className="text-2xl font-bold mt-2">{formatCurrency(filteredTotalAmount, currency)}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {timeView === "daily" && "Today"}
                              {timeView === "weekly" && "Last 7 days"}
                              {timeView === "monthly" && "Last 30 days"}
                              {timeView === "all" && "All time"}
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="pt-4">
                            <h3 className="text-lg font-semibold">Total Entries</h3>
                            <p className="text-2xl font-bold mt-2">{data.length}</p>
                            <p className="text-sm text-muted-foreground mt-1">Records</p>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Category Totals</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {categoryTotals.length === 0 ? (
                              <p className="text-muted-foreground">No data available</p>
                            ) : (
                              <div className="space-y-3">
                                {categoryTotals.map(({ category, total }) => (
                                  <div key={category} className="flex justify-between items-center">
                                    <span className="capitalize">{category}</span>
                                    <span className="font-medium">{formatCurrency(total, currency)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Retailer Totals</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {retailerTotals.length === 0 ? (
                              <p className="text-muted-foreground">No data available</p>
                            ) : (
                              <div className="space-y-3">
                                {retailerTotals.map(({ retailer, total }) => (
                                  <div key={retailer} className="flex justify-between items-center">
                                    <span className="capitalize">{retailer}</span>
                                    <span className="font-medium">{formatCurrency(total, currency)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  )}
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Recent Entries</h3>
                    {data.length === 0 ? (
                      <p className="text-muted-foreground">No data entries yet</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full border rounded-lg">
                          <thead>
                            <tr className="bg-muted">
                              <th className="py-2 px-4 text-left">Date</th>
                              <th className="py-2 px-4 text-left">Category</th>
                              <th className="py-2 px-4 text-left">Retailer</th>
                              <th className="py-2 px-4 text-right">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[...data].reverse().slice(0, 5).map((item) => (
                              <tr key={item.id} className="border-b">
                                <td className="py-2 px-4">{new Date(item.date).toLocaleDateString()}</td>
                                <td className="py-2 px-4 capitalize">{item.category}</td>
                                <td className="py-2 px-4 capitalize">{item.retailer}</td>
                                <td className="py-2 px-4 text-right">{formatCurrency(item.price, currency)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="chart">
                <div className="mt-6 space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <Tabs value={timeView} onValueChange={setTimeView}>
                      <TabsList>
                        <TabsTrigger value="daily">Daily</TabsTrigger>
                        <TabsTrigger value="weekly">Weekly</TabsTrigger>
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Group by:</span>
                      <Select value={groupBy} onValueChange={setGroupBy}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="category">Category</SelectItem>
                          <SelectItem value="retailer">Retailer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div ref={chartRef} className="min-h-[400px]">
                    <FinancialChart data={filteredData} groupBy={groupBy} />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={exportToPDF}>Export to PDF</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
