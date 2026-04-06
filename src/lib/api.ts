// src/lib/api.ts
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://192.168.68.101/api";

async function parseJson(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

/**
 * getUrl logic - file-e eita shudhu ekbar-i thakbe
 */
function getUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${cleanPath}`;
}

export async function postJSON<T>(path: string, body?: any, accessToken?: string): Promise<T> {
  const fullUrl = getUrl(path);
  const res = await fetch(fullUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify(body ?? {}),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data as T;
}

export async function getJSON<T>(path: string, accessToken?: string): Promise<T> {
  const fullUrl = getUrl(path);
  const res = await fetch(fullUrl, {
    method: "GET",
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    credentials: "include",
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data as T;
}

export const apiGet = getJSON;
export const apiPost = postJSON;
