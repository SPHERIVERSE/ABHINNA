import { Request, Response } from "express";
import { prisma } from "../config/prisma";

// 1. Create a new notification
export async function createNotification(req: Request, res: Response) {
  try {
    const { message, link, type } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Notification message is required" });
    }

    const notification = await prisma.notification.create({
      data: {
        message,
        link, // Optional
        type: type || "INFO",
        isActive: true,
      },
    });

    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ message: "Failed to create notification" });
  }
}

// 2. Get all notifications (Ordered by newest first)
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

// 3. Toggle Active Status (Show/Hide from ticker without deleting)
export async function toggleNotification(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const notification = await prisma.notification.update({
      where: { id },
      data: { isActive },
    });

    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
}

// 4. Delete
export async function deleteNotification(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.notification.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete" });
  }
}