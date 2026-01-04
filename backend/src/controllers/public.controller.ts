import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function getPublicHomeData(req: Request, res: Response) {
  try {
    // Run parallel queries for speed
    const [courses, faculty, notifications, banners, results] = await Promise.all([
      // 1. Active Courses Only
      prisma.course.findMany({
        where: { isActive: true },
        include: { _count: { select: { batches: true } } },
        orderBy: { createdAt: "desc" },
      }),
      
      // 2. All Faculty with Photos
      prisma.faculty.findMany({
        include: { photo: true },
        orderBy: { createdAt: "asc" },
      }),

      // 3. Active Notifications
      prisma.notification.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      }),

      // 4. Banners (For Hero Slider)
      prisma.asset.findMany({
        where: { type: "BANNER" },
        take: 5,
      }),

      // 5. Results (For Toppers Section)
      prisma.asset.findMany({
        where: { type: "RESULT" },
        take: 6,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    res.json({
      success: true,
      data: { courses, faculty, notifications, banners, results },
    });
  } catch (error) {
    console.error("Public Data Error:", error);
    res.status(500).json({ message: "Failed to load homepage data" });
  }
}