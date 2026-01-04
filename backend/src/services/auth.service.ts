import { prisma } from "../config/prisma";
import { signJwt } from "../utils/jwt";

export async function loginOrRegisterUser(phone: string) {
  let user = await prisma.user.findUnique({ where: { phone } });

  if (!user) {
    user = await prisma.user.create({
      data: { phone },
    });
  }

  const token = signJwt({
    sub: user.id,
    role: "USER",
  });

  return { user, token };
}

