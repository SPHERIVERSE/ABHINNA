import { Router } from "express";
import { sendOtp } from "../services/otp.service";
import { verifyOtp } from "../services/otpVerify.service";
import { setAuthCookie } from "../utils/cookies";
import { loginOrRegisterUser } from "../services/auth.service";

const router = Router();

router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    await sendOtp(phone, req.ip);
    res.json({ success: true });
  } catch (e: any) {
    res.status(429).json({ message: e.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;

    await verifyOtp(phone, otp);

    const { user, token } = await loginOrRegisterUser(phone);

    setAuthCookie(res, token);

    res.json({
      success: true,
      user: { id: user.id, phone: user.phone },
    });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});


export default router;

