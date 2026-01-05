import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./config/prisma";
import cookieParser from "cookie-parser";
import { pageVisitMiddleware } from "./middleware/pageVisit.middleware";

// ✅ Import your routes
import adminRoutes from "./routes/admin.routes";
import authRoutes from "./routes/auth.routes"; 
import publicRoutes from "./routes/public.routes";


dotenv.config();

const app = express();

// ✅ Configure CORS to allow cookies from Frontend (Port 3000)
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "https://specified-channels-view-memories.trycloudflare.com", 
    "https://movements-james-beautifully-infrared.trycloudflare.com"
  ], 
  credentials: true 
}));

app.use(express.json());

// ✅ CRITICAL: You must enable the cookie parser
app.use(cookieParser());

app.use(pageVisitMiddleware);

// ✅ MOUNT THE ROUTES
// This means "http://localhost:4000/admin/login" will now work
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/public", publicRoutes);

app.get("/", (_req, res) => {
  res.send("Backend running 🚀");
});

prisma.$connect()
  .then(() => console.log("Prisma connected ✅"))
  .catch(console.error);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
