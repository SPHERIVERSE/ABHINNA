import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { logActivity } from "../utils/logger"; // 🟢 Added Logger

// 1. Create a new notification
export async function createNotification(req: Request, res: Response) {
  try {
    const { message, link, type } = req.body;
    const admin = (req as any).user; // 🟢 Extract admin context

    if (!message) {
      return res.status(400).json({ message: "Notification message is required" });
    }

    const notification = await prisma.notification.create({
      data: {
        message,
        link, 
        type: type || "INFO",
        isActive: true,
      },
    });

    // 🟢 AUDIT LOG: Record notification creation
    await logActivity(
      admin.sub, 
      admin.username, 
      "CREATE", 
      "NOTIFICATION", 
      { id: notification.id, title: notification.message || "New Announcement" }
    );

    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ message: "Failed to create notification" });
  }
}

// 2. Get all notifications
export async function getNotifications(req: Request, res: Response) {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
}

// ✅ PROFESSIONAL TOGGLE (Show/Hide from ticker)
export async function toggleNotification(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const admin = (req as any).user; // 🟢 Extract admin context

    const existing = await prisma.notification.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Notification not found" });

    const notification = await prisma.notification.update({
      where: { id },
      data: { isActive: isActive ?? !existing.isActive },
    });

    // 🟢 AUDIT LOG: Record status toggle as an UPDATE
    await logActivity(
      admin.sub, 
      admin.username, 
      "UPDATE", 
      "NOTIFICATION", 
      { 
        id: notification.id, 
        title: `${notification.message.substring(0, 30)}... (${notification.isActive ? 'Shown' : 'Hidden'})` 
      }
    );

    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ message: "Failed to update ticker status" });
  }
}

// 4. Delete
export async function deleteNotification(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const admin = (req as any).user; // 🟢 Extract admin context

    // 🟢 PRE-FETCH: Get message before deletion
    const noteToDelete = await prisma.notification.findUnique({ where: { id } });

    await prisma.notification.delete({ where: { id } });

    // 🟢 AUDIT LOG: Record notification deletion
    if (noteToDelete) {
      await logActivity(
        admin.sub, 
        admin.username, 
        "DELETE", 
        "NOTIFICATION", 
        { id: noteToDelete.id, title: noteToDelete.message || "Deleted Announcement" }
      );
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete" });
  }
}