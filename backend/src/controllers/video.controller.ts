import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { VideoCategory, VideoType } from "@prisma/client";
import { logActivity } from "../utils/logger"; // 🟢 Added Logger

const extractExternalId = (url: string) => {
  if (!url) return { id: null, platform: "UNKNOWN" };
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i;
  const ytMatch = url.match(ytRegex);
  if (ytMatch) return { id: ytMatch[1], platform: "YOUTUBE" };

  const instaRegex = /(?:instagram\.com\/(?:p|reels|reel)\/)([^\/?#&]+)/i;
  const instaMatch = url.match(instaRegex);
  if (instaMatch) return { id: instaMatch[1], platform: "INSTAGRAM" };

  const fbRegex = /(?:facebook\.com\/.*\/videos\/|facebook\.com\/watch\/\?v=|fb\.watch\/)([0-9]+)/i;
  const fbMatch = url.match(fbRegex);
  if (fbMatch) return { id: fbMatch[1], platform: "FACEBOOK" };

  return { id: null, platform: "OTHER" };
};

// ✅ CREATE VIDEO
export async function createVideo(req: Request, res: Response) {
  try {
    const { title, videoUrl, description, category, type } = req.body;
    const admin = (req as any).user; // 🟢 Extract admin context

    if (!title || !videoUrl || !admin?.sub) {
      return res.status(400).json({ message: "Title and Video URL are required" });
    }

    const { id, platform } = extractExternalId(videoUrl);

    const video = await prisma.video.create({
      data: {
        title,
        videoUrl,
        externalId: id,
        description,
        category: category as VideoCategory,
        type: type as VideoType,
        platform: platform,
        createdBy: admin.sub,
      },
    });

    // 🟢 AUDIT LOG: Record video creation
    await logActivity(
      admin.sub, 
      admin.username, 
      "CREATE", 
      "VIDEO", 
      { id: video.id, title: video.title || "New Video" }
    );

    res.json({ success: true, video });
  } catch (error) {
    console.error("Create Video Error:", error);
    res.status(500).json({ message: "Failed to register video record" });
  }
}

// ✅ GET VIDEOS
export async function getVideos(req: Request, res: Response) {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, videos });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch video library" });
  }
}

// ✅ UPDATE VIDEO
export async function updateVideo(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, videoUrl, description, category, type } = req.body;
    const admin = (req as any).user; // 🟢 Extract admin context

    const { id: externalId, platform } = extractExternalId(videoUrl);

    const video = await prisma.video.update({
      where: { id },
      data: {
        title,
        videoUrl,
        externalId,
        description,
        category,
        type,
        platform,
      },
    });

    // 🟢 AUDIT LOG: Record video update
    await logActivity(
      admin.sub, 
      admin.username, 
      "UPDATE", 
      "VIDEO", 
      { id: video.id, title: video.title || "Updated Video" }
    );

    res.json({ success: true, video });
  } catch (error) {
    res.status(500).json({ message: "Failed to update video record" });
  }
}

// ✅ DELETE VIDEO
export async function deleteVideo(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const admin = (req as any).user; // 🟢 Extract admin context

    // 🟢 PRE-FETCH: Get title before deletion
    const videoToDelete = await prisma.video.findUnique({ where: { id } });

    await prisma.video.delete({ where: { id } }); 

    // 🟢 AUDIT LOG: Record video deletion
    if (videoToDelete) {
      await logActivity(
        admin.sub, 
        admin.username, 
        "DELETE", 
        "VIDEO", 
        { id: videoToDelete.id, title: videoToDelete.title || "Deleted Video" }
      );
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete video" });
  }
}