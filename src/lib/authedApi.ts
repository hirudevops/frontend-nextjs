import { apiGet, apiPost } from "./api";
import { getAccessToken } from "./authStore";

export async function authedGet<T>(path: string): Promise<T> {
  const token = getAccessToken();
  if (!token) throw new Error("Not authenticated");
  return apiGet<T>(path, { headers: { Authorization: `Bearer ${token}` } });
}

export async function authedPost<T>(path: string, body: any): Promise<T> {
  const token = getAccessToken();
  if (!token) throw new Error("Not authenticated");
  return apiPost<T>(path, body, { headers: { Authorization: `Bearer ${token}` } });
}
