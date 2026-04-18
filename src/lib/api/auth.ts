import { APP_STORAGE_KEYS, createId, wait } from "@/lib/utils";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  token: string;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export async function loginWithAnyCredentials(
  email: string,
  password: string
): Promise<SessionUser> {
  if (!email.trim() || !password.trim()) {
    throw new Error("Email and password are required.");
  }

  await wait(300);
  const user: SessionUser = {
    id: createId("user"),
    email: email.trim(),
    name: email.split("@")[0] || "CarStage User",
    token: createId("session"),
  };

  if (isBrowser()) {
    window.localStorage.setItem(APP_STORAGE_KEYS.session, JSON.stringify(user));
  }

  return user;
}

export function getSession(): SessionUser | null {
  if (!isBrowser()) {
    return null;
  }

  const raw = window.localStorage.getItem(APP_STORAGE_KEYS.session);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function logout(): void {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.removeItem(APP_STORAGE_KEYS.session);
}
