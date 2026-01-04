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

  const token = signJwt({
    sub: admin.id,
    role: admin.role,
  });

  return { admin, token };
}

