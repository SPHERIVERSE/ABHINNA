import prisma from "../config/prisma";

export async function getAdminStats() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    usersToday,
    totalVisits,
    visitsToday
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: { createdAt: { gte: todayStart } }
    }),
    prisma.pageVisit.count(),
    prisma.pageVisit.count({
      where: { createdAt: { gte: todayStart } }
    })
  ]);

  return {
    totalUsers,
    usersToday,
    totalPageVisits: totalVisits,
    visitsToday
  };
}

