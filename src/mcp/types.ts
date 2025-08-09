// MCP Types
export interface Request {
  method: string;
  params?: Record<string, any>;
}

export interface Response {
  result?: any;
  error?: {
    code: number;
    message: string;
  };
}

export interface MCPContext {
  // Add any context properties you need
  userId?: string;
  currency?: string;
}

// Financial data types
export interface FinancialData {
  id: string;
  date: string;
  price: number;
  category: string;
  retailer: string;
}

export interface FinancialSummary {
  totalAmount: number;
  filteredTotalAmount: number;
  totalEntries: number;
  categoryTotals: { category: string; total: number }[];
  retailerTotals: { retailer: string; total: number }[];
}

export interface TimeFilter {
  type: 'daily' | 'weekly' | 'monthly' | 'all';
  startDate?: string;
  endDate?: string;
}

export type MCPHandler = (request: Request, context: MCPContext) => Promise<Response>;