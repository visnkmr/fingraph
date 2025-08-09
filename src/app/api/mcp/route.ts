import { NextRequest } from 'next/server';
import { MCPServer } from '@/mcp/server';
import { Request as MCPRequest, MCPContext } from '@/mcp/types';
import { cookies } from 'next/headers';

// Create a singleton instance of the MCP server
const mcpServer = new MCPServer();
mcpServer.registerBuiltinHandlers();
mcpServer.registerFinancialHandlers();

// Register any custom handlers here
// Example:
// mcpServer.registerHandler('financial.summary', async (req) => {
//   // Implementation for financial summary
//   return { result: { balance: 1000, income: 5000, expenses: 4000 } };
// });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const mcpRequest: MCPRequest = body;
    
    // Create context (you might want to extract user info from auth headers)
    const cookieStore = cookies();
    const currency = cookieStore.get('currency')?.value || 'USD';
    
    const context: MCPContext = {
      // userId: request.headers.get('x-user-id') || undefined,
      currency
    };
    
    const response = await mcpServer.handleRequest(mcpRequest, context);
    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: {
        code: -32700,
        message: 'Parse error'
      }
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}