import { prisma } from "../config/prisma";
import { generateOtp, hashOtp } from "../utils/otp";
import { checkOtpLimit } from "./otpRateLimit.service";

export async function sendOtp(phone: string, ip?: string) {
  await checkOtpLimit(phone, ip);

  const otp = generateOtp();
  const hash = hashOtp(otp);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.otp.deleteMany({ where: { phone } });

  await prisma.otp.create({
    data: { phone, codeHash: hash, expiresAt },
  });

  await prisma.otpRequest.upsert({
    where: { phone },
    update: {
      requestCount: { increment: 1 },
      dailyCount: { increment: 1 },
      lastRequestedAt: new Date(),
      ipAddress: ip,
    },
    create: {
      phone,
      ipAddress: ip,
      requestCount: 1,
      dailyCount: 1,
      lastRequestedAt: new Date(),
    },
  });

  // DEV ONLY
  if (process.env.NODE_ENV === "development") {
    console.log("OTP:", otp);
  }

  // TODO: MSG91 send here
}

