import { prisma } from "../config/prisma";
import { compareOtp } from "../utils/otp";

export async function verifyOtp(phone: string, otp: string) {
  const record = await prisma.otp.findFirst({
    where: {
      phone,
      expiresAt: { gt: new Date() },
    },
  });

  if (!record || !compareOtp(otp, record.codeHash)) {
    throw new Error("Invalid or expired OTP");
  }

  await prisma.otp.delete({ where: { id: record.id } });

  await prisma.otpRequest.update({
    where: { phone },
    data: { requestCount: 0 },
  });

  return true;
}

