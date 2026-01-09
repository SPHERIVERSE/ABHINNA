import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function getPublicHomeData(req: Request, res: Response) {
  try {
    const [
      courses, allFaculty, notifications, 
      banners, gallery, results, 
      posters, allVideos, featuredFeedback // 🟢 Added feedback fetch
    ] = await Promise.all([
      // ... existing fetches ...
      prisma.course.findMany({
        where: { isActive: true },
        include: { _count: { select: { batches: true } } },
        orderBy: { createdAt: "desc" },
      }),
      
      prisma.faculty.findMany({ 
        include: { photo: true }, 
        orderBy: { experience: "desc" } 
      }),

      prisma.notification.findMany({ 
        where: { isActive: true }, 
        orderBy: { createdAt: "desc" } 
      }),

      prisma.asset.findMany({ 
        where: { type: "BANNER" },
        select: { id: true, fileUrl: true, title: true, width: true, height: true },
        take: 5 
      }),

      prisma.asset.findMany({ 
        where: { type: "GALLERY" }, 
        take: 16, 
        orderBy: { createdAt: "desc" } 
      }),

      prisma.asset.findMany({ 
        where: { type: "RESULT" }, 
        orderBy: { createdAt: "desc" },
        take: 24 
      }),

      prisma.asset.findMany({ 
        where: { type: "POSTER" }, 
        orderBy: { createdAt: "desc" },
        take: 5 
      }),

      prisma.video.findMany({
        orderBy: { createdAt: "desc" },
      }),

      // 🟢 NEW: Fetch Featured Testimonials
      prisma.feedback.findMany({
        where: { isFeatured: true },
        select: { id: true, name: true, comment: true, rating: true, createdAt: true },
        orderBy: { createdAt: "desc" }
      })
    ]);

    // ... existing categorization logic ...
    const landscapeVideos = allVideos.filter(v => v.type === "LONG_FORM");
    const portraitVideos = allVideos.filter(v => v.type === "SHORT");

    const leadership = allFaculty.filter(f => f.categories.includes("LEADERSHIP"));
    const management = allFaculty.filter(f => f.categories.includes("MANAGEMENT"));
    const teachingFaculty = allFaculty.filter(f => f.categories.includes("TEACHING"));

    const formattedPosters = posters.map(p => ({
      id: p.id,
      message: p.title || "New Announcement",
      link: p.fileUrl, 
      type: "POSTER",
      isActive: true,
      createdAt: p.createdAt
    }));

    const finalNotifications = [...formattedPosters, ...notifications];

    res.json({
      success: true,
      data: { 
        courses, 
        faculty: teachingFaculty,
        leadership,
        management,
        notifications: finalNotifications,
        banners,
        gallery,
        results,
        videos: {
          landscape: landscapeVideos,
          shorts: portraitVideos
        },
        testimonials: featuredFeedback // 🟢 Now available for the frontend slider
      },
    });
  } catch (error) {
    console.error("Public Data Error:", error);
    res.status(500).json({ message: "Failed to load professional homepage data" });
  }
}