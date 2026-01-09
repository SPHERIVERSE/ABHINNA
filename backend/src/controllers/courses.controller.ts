import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { CourseCategory, Stream } from "@prisma/client";
import { logActivity } from "../utils/logger"; // 🟢 Added Logger

export async function createCourse(req: Request, res: Response) {
  try {
    const { title, description, category, subCategory, stream, duration} = req.body;
    const admin = (req as any).user; // 🟢 Extract admin context

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        category: category as CourseCategory || "ENTRANCE",
        subCategory,
        stream: stream as Stream || "NONE",
        duration: duration || null,
        isActive: true, 
      },
    });

    // 🟢 AUDIT LOG: Record course creation
    await logActivity(
      admin.sub, 
      admin.username, 
      "CREATE", 
      "COURSE", 
      { id: course.id, title: course.title || "Unnamed Course" }
    );

    res.json({ success: true, course });
  } catch (error) {
    console.error("Create Course Error:", error);
    res.status(500).json({ message: "Failed to create course" });
  }
}

export async function getCourses(req: Request, res: Response) {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { batches: true } 
        }
      }
    });

    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
}

export async function updateCourse(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, description, isActive, category, subCategory, stream, duration } = req.body;
    const admin = (req as any).user; // 🟢 Extract admin context

    const course = await prisma.course.update({
      where: { id },
      data: { 
        title, 
        description, 
        isActive,
        category: category as CourseCategory,
        subCategory,
        stream: stream as Stream,
        duration
       },
    });

    // 🟢 AUDIT LOG: Record course update
    await logActivity(
      admin.sub, 
      admin.username, 
      "UPDATE", 
      "COURSE", 
      { id: course.id, title: course.title || "Updated Course" }
    );

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ message: "Failed to update course" });
  }
}

export async function deleteCourse(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const admin = (req as any).user; // 🟢 Extract admin context

    // 🟢 PRE-FETCH: Get title before deletion
    const courseToDelete = await prisma.course.findUnique({ where: { id } });

    await prisma.course.delete({
      where: { id },
    });

    // 🟢 AUDIT LOG: Record course deletion
    if (courseToDelete) {
      await logActivity(
        admin.sub, 
        admin.username, 
        "DELETE", 
        "COURSE", 
        { id: courseToDelete.id, title: courseToDelete.title || "Deleted Course" }
      );
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete course" });
  }
}

export async function toggleCourseStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const admin = (req as any).user; // 🟢 Extract admin context

    const course = await prisma.course.update({
      where: { id },
      data: { isActive },
    });

    // 🟢 AUDIT LOG: Record status toggle as an UPDATE
    await logActivity(
      admin.sub, 
      admin.username, 
      "UPDATE", 
      "COURSE", 
      { id: course.id, title: `${course.title} (${isActive ? 'Activated' : 'Deactivated'})` }
    );

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ message: "Failed to update course" });
  }
}