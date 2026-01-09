import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { logActivity } from "../utils/logger"; // 🟢 Added Logger

// ✅ CREATE BATCH
export async function createBatch(req: Request, res: Response) {
  try {
    const { name, courseId, startDate, endDate } = req.body;
    const admin = (req as any).user; // 🟢 Extract admin context

    if (!name || !courseId || !startDate) {
      return res.status(400).json({ message: "Name, Course, and Start Date are required" });
    }

    const batch = await prisma.batch.create({
      data: {
        name,
        courseId,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isActive: true,
      },
    });

    // 🟢 AUDIT LOG: Record batch creation
    await logActivity(
      admin.sub, 
      admin.username, 
      "CREATE", 
      "BATCH", 
      { id: batch.id, title: batch.name || "Unnamed Batch" }
    );

    res.json({ success: true, batch });
  } catch (error) {
    console.error("Create Batch Error:", error);
    res.status(500).json({ message: "Failed to create batch" });
  }
}

// ✅ GET BATCHES
export async function getBatches(req: Request, res: Response) {
  try {
    const batches = await prisma.batch.findMany({
      orderBy: { startDate: "desc" },
      include: {
        course: {
          select: { 
            title: true,
            subCategory: true
           } 
        }
      }
    });
    res.json({ success: true, batches });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch batches" });
  }
}

// ✅ UPDATE BATCH
export async function updateBatch(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, startDate, endDate, isActive } = req.body;
    const admin = (req as any).user; // 🟢 Extract admin context

    const batch = await prisma.batch.update({
      where: { id },
      data: {
        name,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        isActive
      },
      include: { course: { select: { title: true, subCategory: true } } }
    });

    // 🟢 AUDIT LOG: Record batch update
    await logActivity(
      admin.sub, 
      admin.username, 
      "UPDATE", 
      "BATCH", 
      { id: batch.id, title: batch.name || "Updated Batch" }
    );

    res.json({ success: true, batch });
  } catch (error) {
    res.status(500).json({ message: "Failed to update batch" });
  }
}

// ✅ DELETE BATCH
export async function deleteBatch(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const admin = (req as any).user; // 🟢 Extract admin context

    // 🟢 PRE-FETCH: Get title before deletion
    const batchToDelete = await prisma.batch.findUnique({ where: { id } });

    await prisma.batch.delete({ where: { id } });

    // 🟢 AUDIT LOG: Record batch deletion
    if (batchToDelete) {
      await logActivity(
        admin.sub, 
        admin.username, 
        "DELETE", 
        "BATCH", 
        { id: batchToDelete.id, title: batchToDelete.name || "Deleted Batch" }
      );
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete batch" });
  }
}