import { prisma } from "../config/prisma";

// Define enums to match your new schema
export type ActivityAction = "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "VISIT";
export type ActivityCategory = "ASSET" | "VIDEO" | "COURSE" | "BATCH" | "FACULTY" | "NOTIFICATION" | "SYSTEM";

export async function logActivity(
  adminId: string,
  adminName: string,
  action: ActivityAction,
  category: ActivityCategory,
  target?: { id: string; title: string }
) {
  try {
    await prisma.activityLog.create({
      data: {
        action,
        category,
        targetId: target?.id,
        targetTitle: target?.title,
        adminId,
        adminName,
      }
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}