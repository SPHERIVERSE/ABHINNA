import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function adminStatsController(req: Request, res: Response) {
  try {
    // 🟢 Get time period from query (default to 7 days)
    const days = parseInt(req.query.days as string) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [
      totalVisits, 
      totalUsers, 
      totalAssets, 
      totalVideos, 
      activeNotifications, 
      totalCourses,
      recentLogs, 
      teamStats,
      trafficData
    ] = await Promise.all([
      prisma.pageVisit.count(),
      prisma.user.count(),
      prisma.asset.count(),
      prisma.video.count(),
      prisma.notification.count({ where: { isActive: true } }),
      prisma.course.count({ where: { isActive: true } }),
      
      prisma.activityLog.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
      }),

      prisma.admin.findMany({
        select: {
          id: true,
          username: true,
          totalVisits: true,
          lastLogin: true
        },
        orderBy: { totalVisits: "desc" }
      }),

      // 🟢 NEW: Fetch visits for the trend graph based on 'days'
      prisma.pageVisit.findMany({
        where: { visitedAt: { gte: startDate } },
        select: { visitedAt: true },
        orderBy: { visitedAt: "asc" }
      })
    ]);

    // 🟢 AGGREGATION LOGIC: Grouping visits by date for the Line Graph
    const trendsMap: Record<string, number> = {};
    
    // Pre-populate the map with 0s for each day to avoid graph gaps
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      trendsMap[d.toISOString().split('T')[0]] = 0;
    }

    trafficData.forEach(visit => {
      const dateKey = visit.visitedAt.toISOString().split('T')[0];
      if (trendsMap[dateKey] !== undefined) {
        trendsMap[dateKey]++;
      }
    });

    const trends = Object.entries(trendsMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.json({
      success: true,
      stats: {
        visits: totalVisits || 0,
        users: totalUsers || 0,
        assets: totalAssets || 0,
        videos: totalVideos || 0,
        notifications: activeNotifications || 0,
        courses: totalCourses || 0,
      },
      recentLogs: recentLogs || [],
      teamStats: teamStats || [],
      trends // 🟢 Array of { date, count } for Recharts
    });
  } catch (error) {
    console.error("Dashboard Stats Fetch Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch professional dashboard metrics" 
    });
  }
}