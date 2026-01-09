import { prisma } from "../config/prisma";

export async function getAdminStats() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    usersToday,
    totalVisits,
    visitsToday,
    totalAssets,
    totalVideos,
    totalCourses
  ] = await Promise.all([
    // User Metrics
    prisma.user.count(),
    prisma.user.count({
      where: { createdAt: { gte: todayStart } }
    }),
    
    // Traffic Metrics
    prisma.pageVisit.count(),
    prisma.pageVisit.count({
      where: { visitedAt: { gte: todayStart } } // Note: Using 'visitedAt' from schema
    }),

    // Content Metrics
    prisma.asset.count(),
    prisma.video.count(),
    prisma.course.count({ where: { isActive: true } })
  ]);

  return {
    totalUsers,
    usersToday,
    totalPageVisits: totalVisits,
    visitsToday,
    totalAssets,
    totalVideos,
    totalCourses
  };
}

export async function getTrafficTrends(days: number = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Fetch visits from the last X days
  const visits = await prisma.pageVisit.findMany({
    where: { visitedAt: { gte: startDate } },
    select: { visitedAt: true },
    orderBy: { visitedAt: "asc" }
  });

  // Group by date (YYYY-MM-DD)
  const trends: Record<string, number> = {};
  
  // Pre-fill all dates with 0 so the graph doesn't have gaps
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    trends[d.toISOString().split('T')[0]] = 0;
  }

  visits.forEach(v => {
    const date = v.visitedAt.toISOString().split('T')[0];
    if (trends[date] !== undefined) trends[date]++;
  });

  return Object.entries(trends)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}