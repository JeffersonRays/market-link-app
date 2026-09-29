export type ApiResult<T> = {
  success: boolean;
  data: T;
  message?: string;
  meta?: { page: number; limit: number; total: number; total_pages: number };
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");
const TOKEN_KEY = "marketlink_token";
const USER_KEY = "marketlink_user";
const SESSION_EVENT = "marketlink:session-change";

function notifySessionChange() {
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event(SESSION_EVENT));
}

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  role: "customer" | "farmer" | "admin";
  account_status?: string;
  farmer_profile?: {
    id: number;
    business_name: string;
    approval_status: string;
  };
};

export function saveSession(user: User, token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  notifySessionChange();
}

export function getToken() {
  return typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY);
}

export function getSavedUser(): User | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(USER_KEY);
  try {
    return value ? (JSON.parse(value) as User) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  notifySessionChange();
}

export const sessionChangeEvent = SESSION_EVENT;

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResult<T>> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  )
    headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(
      `${API_URL}${path.startsWith("/") ? path : `/${path}`}`,
      { ...options, headers, cache: "no-store" },
    );
  } catch {
    throw new Error(
      "Could not reach MarketLink. Check that the API is running.",
    );
  }

  const body = (await response.json().catch(() => ({}))) as ApiResult<T>;
  if (!response.ok || body.success === false) {
    if (response.status === 401) clearSession();
    throw new Error(body.message || `Request failed (${response.status})`);
  }
  return body;
}

export const apiData = async <T>(path: string, options?: RequestInit) =>
  (await api<T>(path, options)).data;
export const jsonBody = (value: unknown): RequestInit => ({
  method: "POST",
  body: JSON.stringify(value),
});
export const patchBody = (value: unknown): RequestInit => ({
  method: "PATCH",
  body: JSON.stringify(value),
});
export const roleHome = (role: User["role"]) =>
  role === "admin" ? "/admin/dashboard" : `/${role}/dashboard`;
