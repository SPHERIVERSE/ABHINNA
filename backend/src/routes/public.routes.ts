import { Router } from "express";
import { getPublicHomeData } from "../controllers/public.controller";
import { submitFeedback } from "../controllers/feedback.controller"; // 🟢 Import submission logic

const router = Router();

// 👇 This route has NO middleware. It is open to the world.
router.get("/home", getPublicHomeData);

// 🟢 NEW: Public endpoint for student feedback submissions
router.post("/feedback", submitFeedback); 

export default router;