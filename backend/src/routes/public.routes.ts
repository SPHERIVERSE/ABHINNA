import { Router } from "express";
import { getPublicHomeData } from "../controllers/public.controller";

const router = Router();

// 👇 This route has NO middleware. It is open to the world.
router.get("/home", getPublicHomeData);

export default router;