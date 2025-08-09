import { Request, Response, MCPHandler, MCPContext, FinancialData, FinancialSummary, TimeFilter } from './types';

export class MCPServer {
  private handlers: Map<string, MCPHandler> = new Map();

  // Register a handler for a method
  registerHandler(method: string, handler: MCPHandler): void {
    this.handlers.set(method, handler);
  }

  // Handle an incoming request
  async handleRequest(request: Request, context: MCPContext = {}): Promise<Response> {
    const handler = this.handlers.get(request.method);
    
    if (!handler) {
      return {
        error: {
          code: -32601,
          message: `Method not found: ${request.method}`
        }
      };
    }

    try {
      return await handler(request, context);
    } catch (error) {
      return {
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : 'Internal error'
        }
      };
    }
  }

  // Example handlers
  registerBuiltinHandlers(): void {
    // Ping handler
    this.registerHandler('ping', async () => {
      return { result: 'pong' };
    });

    // Echo handler
    this.registerHandler('echo', async (req) => {
      return { result: req.params?.message || null };
    });
  }

  // Financial handlers
  registerFinancialHandlers(): void {
    // Add financial data
    this.registerHandler('financial.add', async (req, context) => {
      const { data } = req.params || {};
      
      if (!data || !data.date || !data.price || !data.category || !data.retailer) {
        return {
          error: {
            code: -32602,
            message: 'Invalid financial data provided'
          }
        };
      }

      // In a real implementation, you would save this to a database
      // For now, we'll just return a success response
      const newData: FinancialData = {
        id: Math.random().toString(36).substr(2, 9),
        date: data.date,
        price: data.price,
        category: data.category,
        retailer: data.retailer
      };

      return { result: { success: true, data: newData } };
    });

    // Get financial summary
    this.registerHandler('financial.summary', async (req, context) => {
      const { data, timeFilter } = req.params || {};
      
      if (!data || !Array.isArray(data)) {
        return {
          error: {
            code: -32602,
            message: 'Invalid financial data provided'
          }
        };
      }

      const summary = calculateFinancialSummary(data, timeFilter, context.currency || 'USD');
      return { result: summary };
    });

    // Get financial data
    this.registerHandler('financial.get', async (req, context) => {
      // In a real implementation, you would fetch this from a database
      // For now, we'll just return an empty array
      return { result: [] };
    });

    // Delete financial data
    this.registerHandler('financial.delete', async (req) => {
      const { id } = req.params || {};
      
      if (!id) {
        return {
          error: {
            code: -32602,
            message: 'ID is required for deletion'
          }
        };
      }

      // In a real implementation, you would delete this from a database
      // For now, we'll just return a success response
      return { result: { success: true, deletedId: id } };
    });
  }
}

// Helper function to calculate financial summary
function calculateFinancialSummary(
  data: any[], 
  timeFilter: TimeFilter | undefined, 
  currency: string
): FinancialSummary {
  // Filter data based on time filter
  const filteredData = filterDataByTime(data, timeFilter);
  
  // Calculate totals
  const totalAmount = data.reduce((sum: number, item: any) => sum + item.price, 0);
  const filteredTotalAmount = filteredData.reduce((sum: number, item: any) => sum + item.price, 0);
  const totalEntries = data.length;
  
  // Calculate category totals
  const categoryTotals: Record<string, number> = {};
  filteredData.forEach((item: any) => {
    if (categoryTotals[item.category]) {
      categoryTotals[item.category] += item.price;
    } else {
      categoryTotals[item.category] = item.price;
    }
  });
  
  const categoryTotalsArray = Object.entries(categoryTotals)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
  
  // Calculate retailer totals
  const retailerTotals: Record<string, number> = {};
  filteredData.forEach((item: any) => {
    if (retailerTotals[item.retailer]) {
      retailerTotals[item.retailer] += item.price;
    } else {
      retailerTotals[item.retailer] = item.price;
    }
  });
  
  const retailerTotalsArray = Object.entries(retailerTotals)
    .map(([retailer, total]) => ({ retailer, total }))
    .sort((a, b) => b.total - a.total);
  
  return {
    totalAmount,
    filteredTotalAmount,
    totalEntries,
    categoryTotals: categoryTotalsArray,
    retailerTotals: retailerTotalsArray
  };
}

// Helper function to filter data by time
function filterDataByTime(data: any[], timeFilter: TimeFilter | undefined): any[] {
  if (!timeFilter) {
    return data;
  }
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  if (timeFilter.type === "daily") {
    return data.filter((d: any) => {
      const dataDate = new Date(d.date);
      const dataDay = new Date(dataDate.getFullYear(), dataDate.getMonth(), dataDate.getDate());
      return dataDay.getTime() === today.getTime();
    });
  }
  
  if (timeFilter.type === "weekly") {
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    return data.filter((d: any) => {
      const dataDate = new Date(d.date);
      const dataDay = new Date(dataDate.getFullYear(), dataDate.getMonth(), dataDate.getDate());
      return dataDay >= oneWeekAgo && dataDay <= today;
    });
  }
  
  if (timeFilter.type === "monthly") {
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    return data.filter((d: any) => {
      const dataDate = new Date(d.date);
      const dataDay = new Date(dataDate.getFullYear(), dataDate.getMonth(), dataDate.getDate());
      return dataDay >= oneMonthAgo && dataDay <= today;
    });
  }
  
  return data;
}