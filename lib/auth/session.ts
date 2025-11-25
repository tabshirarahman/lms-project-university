"use server"
import { cookies } from "next/headers"
import { generateToken, JWTPayload, verifyToken } from "./auth";

const COOKIE_NAME = "auth-token";

export async function getSession(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return null;

    const payload = verifyToken(token);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function setSession(payload: JWTPayload): Promise<void> {
  const cookieStore = await cookies();
  const token = generateToken(payload);

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}