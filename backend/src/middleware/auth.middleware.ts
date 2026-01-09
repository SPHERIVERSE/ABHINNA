import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";

export function requireAuth(roles?: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.session;
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      const payload = verifyJwt(token) as any;

      if (roles && !roles.includes(payload.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // 🟢 Attach full payload so we have req.user.username for logging
      (req as any).user = payload; 
      next();
    } catch {
      return res.status(401).json({ message: "Invalid session" });
    }
  };
}

export const requireAdmin = requireAuth(["ADMIN", "SUPER_ADMIN"]);

