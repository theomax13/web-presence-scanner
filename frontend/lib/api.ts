const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ScanResult {
  id: string;
  source: string;
  status: string;
  data: Record<string, unknown> | null;
  error: string | null;
  created_at: string;
}

export interface Scan {
  id: string;
  query: string;
  input_type: string;
  status: string;
  created_at: string;
  completed_at: string | null;
  results: ScanResult[];
}

function authHeaders(token: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function createScan(query: string, token: string): Promise<Scan> {
  const res = await fetch(`${API_BASE}/api/v1/scans`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`Scan failed: ${res.status}`);
  return res.json();
}

export async function getScan(id: string, token: string): Promise<Scan> {
  const res = await fetch(`${API_BASE}/api/v1/scans/${id}`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(`Scan not found: ${res.status}`);
  return res.json();
}
