import { getJSON, postJSON } from "./api";
import { getAccessToken } from "./authStore";

export async function authedGet<T>(path: string): Promise<T> {
  const token = getAccessToken();
  if (!token) throw new Error("Not authenticated");
  return getJSON<T>(path, token);
}

export async function authedPost<T>(path: string, body: any): Promise<T> {
  const token = getAccessToken();
  if (!token) throw new Error("Not authenticated");
  return postJSON<T>(path, body, token);
}

