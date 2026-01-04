import { Request, Response } from "express";
import { getAdminStats } from "../services/adminStats.service";
import { prisma } from "../config/prisma";

export async function adminStatsController(req: Request, res: Response) {
  try {
    // Run all queries in parallel for speed
    const [totalVisits, totalUsers, totalAssets, activeNotifications] = await Promise.all([
      prisma.pageVisit.count(),
      prisma.user.count(),
      prisma.asset.count(),
      prisma.notification.count({ where: { isActive: true } }),
    ]);

    res.json({
      success: true,
      stats: {
        visits: totalVisits,
        users: totalUsers, // Registrations
        assets: totalAssets,
        notifications: activeNotifications,
      },
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
}

