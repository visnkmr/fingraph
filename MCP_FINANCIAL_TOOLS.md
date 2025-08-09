# Financial MCP Tools

This document describes the MCP (Model Context Protocol) tools that have been added to the financial tracker application.

## Overview

MCP tools provide a structured way to interact with the financial tracker's backend functionality. These tools can be used by AI assistants or other clients to perform financial operations.

## Available Tools

### 1. `financial.add`
Add a new financial data entry.

**Parameters:**
- `data` (object): The financial data to add
  - `date` (string): The date of the transaction (YYYY-MM-DD format)
  - `price` (number): The price/amount of the transaction
  - `category` (string): The category of the transaction
  - `retailer` (string): The retailer information

**Returns:**
- `success` (boolean): Whether the operation was successful
- `data` (object): The added financial data with an ID

### 2. `financial.summary`
Get a summary of financial data with optional time filtering.

**Parameters:**
- `data` (array): Array of financial data objects
- `timeFilter` (object, optional): Time filter parameters
  - `type` (string): One of 'daily', 'weekly', 'monthly', 'all'
  - `startDate` (string, optional): Start date for custom filtering
  - `endDate` (string, optional): End date for custom filtering

**Returns:**
- `totalAmount` (number): Total amount across all data
- `filteredTotalAmount` (number): Total amount for the filtered data
- `totalEntries` (number): Number of total entries
- `categoryTotals` (array): Array of category totals
- `retailerTotals` (array): Array of retailer totals

### 3. `financial.get`
Retrieve financial data entries.

**Parameters:** None

**Returns:**
- Array of financial data objects

### 4. `financial.delete`
Delete a financial data entry by ID.

**Parameters:**
- `id` (string): The ID of the entry to delete

**Returns:**
- `success` (boolean): Whether the operation was successful
- `deletedId` (string): The ID of the deleted entry

## Example Usage

### Adding Financial Data
```json
{
  "method": "financial.add",
  "params": {
    "data": {
      "date": "2023-05-15",
      "price": 29.99,
      "category": "shopping",
      "retailer": "online"
    }
  }
}
```

### Getting Financial Summary
```json
{
  "method": "financial.summary",
  "params": {
    "data": [...],
    "timeFilter": {
      "type": "weekly"
    }
  }
}
```

## Client Implementation

The MCP client provides convenient methods for each tool:

```typescript
const client = new MCPClient();

// Add financial data
const newData = await client.addFinancialData({
  date: "2023-05-15",
  price: 29.99,
  category: "shopping",
  retailer: "online"
});

// Get financial summary
const summary = await client.getFinancialSummary(financialData, {
  type: "weekly"
});
```

## Component Integration

The `FinancialAnalysis` component demonstrates how to use the MCP tools in a React component. It automatically fetches and displays financial summaries based on the provided data and time filters.