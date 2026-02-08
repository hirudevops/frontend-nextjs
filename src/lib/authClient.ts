import { getJSON, postJSON } from "./api";

export type AccessTokenResponse = { access_token: string };

export async function register(email: string, password: string): Promise<string> {
  const r = await postJSON<AccessTokenResponse>("/auth/register", { email, password });
  return r.access_token;
}

export async function login(email: string, password: string): Promise<string> {
  const r = await postJSON<AccessTokenResponse>("/auth/login", { email, password });
  return r.access_token;
}

export async function refresh(): Promise<string> {
  const r = await postJSON<AccessTokenResponse>("/auth/refresh", {});
  return r.access_token;
}

export async function me(accessToken: string): Promise<any> {
  return getJSON<any>("/auth/me", accessToken);
}

export async function logout(accessToken?: string): Promise<void> {
  await postJSON("/auth/logout", {}, accessToken);
}
