'use client';

import { useEffect, useState } from 'react';
import { MCPClient } from '@/mcp/client';

export default function MCPDemo() {
  const [pingResult, setPingResult] = useState<string | null>(null);
  const [echoResult, setEchoResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const client = new MCPClient();

  const handlePing = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await client.ping();
      setPingResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleEcho = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await client.echo('Hello MCP!');
      setEchoResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">MCP Demo</h2>
      
      <div className="space-y-4">
        <div>
          <button 
            onClick={handlePing}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Ping MCP Server
          </button>
          {pingResult && (
            <div className="mt-2 p-2 bg-green-100 text-green-800 rounded">
              Ping Result: {pingResult}
            </div>
          )}
        </div>
        
        <div>
          <button 
            onClick={handleEcho}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            Echo "Hello MCP!"
          </button>
          {echoResult && (
            <div className="mt-2 p-2 bg-purple-100 text-purple-800 rounded">
              Echo Result: {echoResult}
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-800 rounded">
          Error: {error}
        </div>
      )}
      
      {loading && (
        <div className="mt-4 text-blue-600">
          Loading...
        </div>
      )}
    </div>
  );
}