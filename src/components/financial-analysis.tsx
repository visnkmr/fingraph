'use client';

import { useEffect, useState } from 'react';
import { MCPClient } from '@/mcp/client';
import { FinancialData, FinancialSummary, TimeFilter } from '@/mcp/types';

export default function FinancialAnalysis({ data }: { data: FinancialData[] }) {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>({ type: 'all' });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const client = new MCPClient();

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await client.getFinancialSummary(data, timeFilter);
      setSummary(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data.length > 0) {
      fetchSummary();
    }
  }, [data, timeFilter]);

  const handleTimeFilterChange = (filterType: TimeFilter['type']) => {
    setTimeFilter({ type: filterType });
  };

  if (data.length === 0) {
    return (
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-bold mb-4">Financial Analysis</h2>
        <p className="text-muted-foreground">No data available for analysis</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Financial Analysis</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleTimeFilterChange('daily')}
            className={`px-3 py-1 text-sm rounded ${
              timeFilter.type === 'daily'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => handleTimeFilterChange('weekly')}
            className={`px-3 py-1 text-sm rounded ${
              timeFilter.type === 'weekly'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => handleTimeFilterChange('monthly')}
            className={`px-3 py-1 text-sm rounded ${
              timeFilter.type === 'monthly'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => handleTimeFilterChange('all')}
            className={`px-3 py-1 text-sm rounded ${
              timeFilter.type === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
          Error: {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Loading analysis...</div>
      ) : summary ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">Total Amount</h3>
              <p className="text-2xl font-bold">${summary.totalAmount.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800">Filtered Total</h3>
              <p className="text-2xl font-bold">${summary.filteredTotalAmount.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-800">Total Entries</h3>
              <p className="text-2xl font-bold">{summary.totalEntries}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Category Breakdown</h3>
              {summary.categoryTotals.length === 0 ? (
                <p className="text-muted-foreground">No data available</p>
              ) : (
                <div className="space-y-2">
                  {summary.categoryTotals.map(({ category, total }) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="capitalize">{category}</span>
                      <span className="font-medium">${total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Retailer Breakdown</h3>
              {summary.retailerTotals.length === 0 ? (
                <p className="text-muted-foreground">No data available</p>
              ) : (
                <div className="space-y-2">
                  {summary.retailerTotals.map(({ retailer, total }) => (
                    <div key={retailer} className="flex justify-between items-center">
                      <span className="capitalize">{retailer}</span>
                      <span className="font-medium">${total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}