"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useSettings } from '@/context/settings-context';

interface FinancialData {
  id: string;
  date: string;
  price: number;
  category: string;
  retailer: string;
}

interface AggregatedData {
  name: string;
  value: number;
}

interface FinancialChartProps {
  data: FinancialData[];
  groupBy: string;
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

export function FinancialChart({ data, groupBy }: FinancialChartProps) {
  const { currency } = useSettings();
  
  const aggregateData = (data: FinancialData[], groupBy: string): AggregatedData[] => {
    if (!data || data.length === 0) return [];
    
    const result: Record<string, number> = {};
    
    data.forEach(item => {
      const key = item[groupBy as keyof FinancialData] as string;
      const price = item.price;
      
      if (result[key]) {
        result[key] += price;
      } else {
        result[key] = price;
      }
    });
    
    return Object.entries(result).map(([name, value]) => ({
      name,
      value
    }));
  };

  const chartData = aggregateData(data, groupBy);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">No data available for the selected period</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 50,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45} 
          textAnchor="end" 
          height={60}
        />
        <YAxis />
        <Tooltip 
          formatter={(value) => [formatCurrency(Number(value), currency), 'Amount']}
          labelFormatter={(label) => `${groupBy}: ${label}`}
        />
        <Legend />
        <Bar dataKey="value" name="Amount">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}