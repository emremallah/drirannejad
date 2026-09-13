export const AUTH_KEY = "clinic-user-id";

export function getUserId() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(AUTH_KEY) ?? "";
}

export function setUserId(id: string) {
  localStorage.setItem(AUTH_KEY, id);
}

export function clearUserId() {
  localStorage.removeItem(AUTH_KEY);
}
