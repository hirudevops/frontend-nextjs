export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";

async function parseJson(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

export async function postJSON<T>(path: string, body?: any, accessToken?: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    credentials: "include", // IMPORTANT: refresh cookie send/receive
    body: JSON.stringify(body ?? {}),
  });

  const data = await parseJson(res);
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data as T;
}

export async function getJSON<T>(path: string, accessToken?: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    credentials: "include",
  });

  const data = await parseJson(res);
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data as T;
}
