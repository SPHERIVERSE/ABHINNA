import { prisma } from "../config/prisma";
import { verifyPassword } from "../utils/password";
import { signJwt } from "../utils/jwt";

export async function adminLogin(username: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { username } });

  if (!admin) {
    throw new Error("Invalid credentials");
  }

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) {
    throw new Error("Invalid credentials");
  }

  // 🟢 NEW: Update tracking fields and log the login
  const updatedAdmin = await prisma.admin.update({
    where: { id: admin.id },
    data: {
      totalVisits: { increment: 1 },
      lastLogin: new Date(),
    }
  });

  const token = signJwt({
    sub: admin.id,
    role: admin.role,
    username: admin.username, // Added username to payload for easy logging
  });

  return { admin: updatedAdmin, token };
}

