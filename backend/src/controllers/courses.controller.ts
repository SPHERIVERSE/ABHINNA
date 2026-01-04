import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function createCourse(req: Request, res: Response) {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        isActive: true, // Default to active
      },
    });

    res.json({ success: true, course });
  } catch (error) {
    console.error("Create Course Error:", error);
    res.status(500).json({ message: "Failed to create course" });
  }
}

export async function getCourses(req: Request, res: Response) {
  try {
    // Fetch courses AND include the count of batches inside them
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { batches: true } // Useful for showing "3 Batches" on the UI
        }
      }
    });

    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
}

// Optional: Toggle Active Status
export async function toggleCourseStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const course = await prisma.course.update({
      where: { id },
      data: { isActive },
    });

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ message: "Failed to update course" });
  }
}