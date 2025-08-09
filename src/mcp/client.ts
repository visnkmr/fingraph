import { Request as MCPRequest, Response as MCPResponse, FinancialData, FinancialSummary, TimeFilter } from '@/mcp/types';

export class MCPClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/mcp') {
    this.baseUrl = baseUrl;
  }

  async call(method: string, params?: Record<string, any>): Promise<MCPResponse> {
    const request: MCPRequest = { method, params };
    
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
  
  async ping(): Promise<string> {
    const response = await this.call('ping');
    if (response.error) {
      throw new Error(response.error.message);
    }
    return response.result;
  }
  
  async echo(message: string): Promise<string> {
    const response = await this.call('echo', { message });
    if (response.error) {
      throw new Error(response.error.message);
    }
    return response.result;
  }

  // Financial methods
  async addFinancialData(data: Omit<FinancialData, 'id'>): Promise<FinancialData> {
    const response = await this.call('financial.add', { data });
    if (response.error) {
      throw new Error(response.error.message);
    }
    return response.result.data;
  }

  async getFinancialSummary(
    data: any[], 
    timeFilter?: TimeFilter
  ): Promise<FinancialSummary> {
    const response = await this.call('financial.summary', { data, timeFilter });
    if (response.error) {
      throw new Error(response.error.message);
    }
    return response.result;
  }

  async getFinancialData(): Promise<FinancialData[]> {
    const response = await this.call('financial.get');
    if (response.error) {
      throw new Error(response.error.message);
    }
    return response.result;
  }

  async deleteFinancialData(id: string): Promise<{ success: boolean; deletedId: string }> {
    const response = await this.call('financial.delete', { id });
    if (response.error) {
      throw new Error(response.error.message);
    }
    return response.result;
  }
}