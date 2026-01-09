import { Request, Response } from "express";
import { prisma } from "../config/prisma";

const VALID_ACTIVITY_CATEGORIES = [
  "ASSET",
  "VIDEO",
  "COURSE",
  "BATCH",
  "FACULTY",
  "NOTIFICATION",
  "SYSTEM",
];

export async function getLogsController(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const {
      action,
      category,
      adminId,
      date,
      search,
    } = req.query as {
      action?: string;
      category?: string;
      adminId?: string;
      date?: string;
      search?: string;
    };

    /* ----------------------------------
       BASE WHERE CLAUSE
    ---------------------------------- */
    const whereClause: any = {};

    /* ----------------------------------
       ACTION FILTER (ENUM — WORKING)
    ---------------------------------- */
    if (action && action !== "ALL") {
      whereClause.action = action;
    }

    /* ----------------------------------
       CATEGORY FILTER (ENUM SAFE)
    ---------------------------------- */
    if (
      category &&
      category !== "ALL" &&
      VALID_ACTIVITY_CATEGORIES.includes(category)
    ) {
      whereClause.category = category;
    }

    /* ----------------------------------
       ADMIN FILTER (ID ONLY)
    ---------------------------------- */
    if (adminId && adminId !== "ALL") {
      whereClause.adminName = adminId;
    }

    /* ----------------------------------
       DATE FILTER (FULL DAY RANGE)
    ---------------------------------- */
    if (date) {
      const start = new Date(`${date}T00:00:00.000`);
      const end = new Date(`${date}T23:59:59.999`);
      whereClause.createdAt = {
        gte: start,
        lte: end,
      };
    }

    /* ----------------------------------
       SEARCH FILTER (STRING FIELDS ONLY)
       ⚠️ NEVER enums
    ---------------------------------- */
    if (search && search.trim()) {
      whereClause.OR = [
        {
          adminName: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
        {
          targetTitle: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
      ];
    }

    /* ----------------------------------
       FETCH DATA
    ---------------------------------- */
    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.activityLog.count({
        where: whereClause,
      }),
    ]);

    res.json({
      success: true,
      logs,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    console.error("Logs Fetch Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch activity logs",
    });
  }
}
