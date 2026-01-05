import { Response } from "express";

export function setAuthCookie(res: Response, token: string) {
  res.cookie("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 1000, // 1 hour
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie("session");
}

