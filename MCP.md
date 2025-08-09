# MCP (Model Context Protocol) Server

This project includes a minimal implementation of an MCP server that allows for structured communication between the frontend and backend.

## Structure

- `src/mcp/server.ts` - The main MCP server implementation
- `src/mcp/types.ts` - Type definitions for MCP requests and responses
- `src/mcp/client.ts` - Client for making requests to the MCP server
- `src/app/api/mcp/route.ts` - Next.js API route that exposes the MCP server
- `src/components/mcp-demo.tsx` - Demo component showing how to use the MCP client
- `src/components/financial-analysis.tsx` - Component demonstrating financial MCP tools

## Usage

### Making Requests

You can make requests to the MCP server by sending POST requests to `/api/mcp` with a JSON body:

```json
{
  "method": "ping",
  "params": {}
}
```

### Built-in Methods

1. `ping` - Returns "pong"
2. `echo` - Returns the message provided in params

### Financial Methods

1. `financial.add` - Add a new financial data entry
2. `financial.summary` - Get a summary of financial data
3. `financial.get` - Retrieve financial data entries
4. `financial.delete` - Delete a financial data entry

See [MCP_FINANCIAL_TOOLS.md](MCP_FINANCIAL_TOOLS.md) for detailed documentation of financial tools.

### Adding Custom Methods

To add custom methods, register handlers with the MCP server in `src/app/api/mcp/route.ts`:

```typescript
mcpServer.registerHandler('custom.method', async (req) => {
  // Implementation
  return { result: { data: "response" } };
});
```

### Using the Client

The MCP client provides a convenient way to make requests:

```typescript
const client = new MCPClient();
const result = await client.ping();
```

## Example

See `src/components/mcp-demo.tsx` for a working example of how to use the MCP client in a React component.
See `src/components/financial-analysis.tsx` for an example of how to use financial MCP tools.