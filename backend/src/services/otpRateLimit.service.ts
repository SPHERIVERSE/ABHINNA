import { prisma } from "../config/prisma";

const COOLDOWN_MS = 60 * 1000;        // 1 min
const WINDOW_MS   = 10 * 60 * 1000;   // 10 min
const MAX_WINDOW  = 3;
const MAX_DAILY   = 10;

export async function checkOtpLimit(phone: string, ip?: string) {
  const now = new Date();

  const record = await prisma.otpRequest.findUnique({ where: { phone } });

  if (record?.blockedUntil && record.blockedUntil > now) {
    throw new Error("Too many requests. Try later.");
  }

  if (record) {
    // Cooldown
    if (now.getTime() - record.lastRequestedAt.getTime() < COOLDOWN_MS) {
      throw new Error("Please wait before requesting OTP again");
    }

    // Reset window
    if (now.getTime() - record.lastRequestedAt.getTime() > WINDOW_MS) {
      record.requestCount = 0;
    }

    if (record.requestCount >= MAX_WINDOW) {
      throw new Error("OTP limit reached. Please wait.");
    }

    if (record.dailyCount >= MAX_DAILY) {
      await prisma.otpRequest.update({
        where: { phone },
        data: {
          blockedUntil: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        },
      });
      throw new Error("Daily OTP limit exceeded");
    }
  }
}

