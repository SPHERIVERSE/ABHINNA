import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { AssetType, FacultyCategory } from "@prisma/client";

export async function createFaculty(req: Request, res: Response) {
  try {
    const { name, designation, bio, photoUrl } = req.body;
    const adminId = (req as any).user?.sub; // Get logged-in admin ID

    if (!name || !designation || !photoUrl || !adminId) {
      return res.status(400).json({ message: "Name, designation, and photo are required" });
    }

    // ✅ PROFESSIONAL: Create Faculty AND Asset in one go (Nested Write)
    const faculty = await prisma.faculty.create({
      data: {
        name,
        designation,
        bio,
        // Automatically create the linked Asset record
        photo: {
          create: {
            title: `Photo of ${name}`,
            type: AssetType.FACULTY,
            fileUrl: photoUrl,
            mimeType: "image/jpeg", // Defaulting for MVP
            size: 0,
            admin: { connect: { id: adminId } } // Link to Admin who added it
          }
        }
      },
      include: { photo: true } // Return the photo details immediately
    });

    res.json({ success: true, faculty });
  } catch (error) {
    console.error("Create Faculty Error:", error);
    res.status(500).json({ message: "Failed to create faculty profile" });
  }
}

export async function getFaculty(req: Request, res: Response) {
  try {
    const facultyList = await prisma.faculty.findMany({
      orderBy: { createdAt: "desc" },
      include: { photo: true } // ✅ IMPORTANT: Fetch the linked photo URL
    });

    res.json({ success: true, facultyList });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch faculty" });
  }
}

export async function deleteFaculty(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.faculty.delete({ where: { id } });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete" });
    }
}

export async function updateFaculty(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, designation, bio, photoUrl, category } = req.body;
    const adminId = (req as any).user?.sub;

    // 1. Update the Faculty Record
    const faculty = await prisma.faculty.update({
      where: { id },
      data: {
        name,
        designation,
        bio,
        category: category as FacultyCategory, // Cast Enum
      }
    });

    // 2. If photo URL changed, we update the asset link
    // (For a simple MVP, we create a new asset link if changed)
    if (photoUrl) {
      // Create new asset entry for the new photo
      const newPhoto = await prisma.asset.create({
        data: {
            title: `Photo of ${name}`,
            type: "FACULTY" as AssetType,
            fileUrl: photoUrl,
            mimeType: "image/jpeg",
            size: 0,
            admin: { connect: { id: adminId } }
        }
      });
      
      // Link it to faculty
      await prisma.faculty.update({
        where: { id },
        data: { photoAssetId: newPhoto.id }
      });
    }

    res.json({ success: true, faculty });
  } catch (error) {
    console.error("Update Faculty Error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
}