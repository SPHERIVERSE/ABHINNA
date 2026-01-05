import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function getPublicHomeData(req: Request, res: Response) {
  try {
    const [courses, allFaculty, notifications, banners, gallery, results, latestPoster] = await Promise.all([
      // 1. Active Courses
      prisma.course.findMany({
        where: { isActive: true },
        include: { _count: { select: { batches: true } } },
        orderBy: { createdAt: "desc" },
      }),
      
      // 2. All Faculty
      prisma.faculty.findMany({ include: { photo: true }, orderBy: { createdAt: "asc" } }),

      // 3. Notifications
      prisma.notification.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } }),

      // 4. Banners (Keep for backup)
      prisma.asset.findMany({ where: { type: "BANNER" }, take: 5 }),

      // 5. ✅ GALLERY (For Hero Carousel) - Fetching more to loop nicely
      prisma.asset.findMany({ 
        where: { type: "GALLERY" }, 
        take: 10,
        orderBy: { createdAt: "desc" } 
      }),

      // 6. ✅ RESULTS (For Bottom Carousel)
      prisma.asset.findMany({ 
        where: { type: "RESULT" }, 
        take: 10, 
        orderBy: { createdAt: "desc" } 
      }),

      // 7. Latest Poster
      prisma.asset.findFirst({ where: { type: "POSTER" }, orderBy: { createdAt: "desc" } }),
    ]);

    // Inject Poster into Notifications
    let finalNotifications = notifications;
    if (latestPoster) {
      finalNotifications = [{
        id: latestPoster.id,
        message: latestPoster.title || "Important Announcement",
        link: latestPoster.fileUrl,
        type: "POPUP",
        isActive: true,
        createdAt: latestPoster.createdAt
      } as any, ...notifications];
    }

    const leadership = allFaculty.filter(f => f.category === "LEADERSHIP");
    const teachingFaculty = allFaculty.filter(f => f.category === "TEACHING");

    res.json({
      success: true,
      data: { courses, faculty: teachingFaculty, leadership, notifications: finalNotifications, banners, gallery, results },
    });
  } catch (error) {
    console.error("Public Data Error:", error);
    res.status(500).json({ message: "Failed to load homepage data" });
  }
}