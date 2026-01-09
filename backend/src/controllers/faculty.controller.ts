import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { AssetType, FacultyCategory } from "@prisma/client";
import { logActivity } from "../utils/logger"; // 🟢 Added Logger

// ✅ CREATE FACULTY (Handles Multi-Category & Experience)
export async function createFaculty(req: Request, res: Response) {
  try {
    const { name, designation, bio, photoUrl, experience, categories } = req.body;
    const admin = (req as any).user; // 🟢 Extract full admin context

    if (!name || !designation || !photoUrl || !admin?.sub) {
      return res.status(400).json({ message: "Name, designation, and photo are required" });
    }

    const faculty = await prisma.faculty.create({
      data: {
        name,
        designation,
        bio,
        experience: parseInt(experience) || 0, 
        categories: categories || ["TEACHING"], 
        photo: {
          create: {
            title: `Photo of ${name}`,
            type: AssetType.FACULTY,
            fileUrl: photoUrl,
            mimeType: "image/jpeg",
            size: 0,
            admin: { connect: { id: admin.sub } }
          }
        }
      },
      include: { photo: true }
    });

    // 🟢 AUDIT LOG: Record faculty creation
    await logActivity(
      admin.sub, 
      admin.username, 
      "CREATE", 
      "FACULTY", 
      { id: faculty.id, title: faculty.name || "Unnamed Faculty" }
    );

    res.json({ success: true, faculty });
  } catch (error) {
    console.error("Create Faculty Error:", error);
    res.status(500).json({ message: "Failed to create faculty profile" });
  }
}

// ✅ GET FACULTY
export async function getFaculty(req: Request, res: Response) {
  try {
    const facultyList = await prisma.faculty.findMany({
      orderBy: { createdAt: "desc" },
      include: { photo: true }
    });

    res.json({ success: true, facultyList });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch faculty" });
  }
}

// ✅ PROFESSIONAL UPDATE FACULTY
export async function updateFaculty(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, designation, bio, photoUrl, experience, categories } = req.body;
    const admin = (req as any).user; // 🟢 Extract admin context

    const currentFaculty = await prisma.faculty.findUnique({
      where: { id },
      include: { photo: true }
    });

    if (!currentFaculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    let updatedPhotoAssetId = currentFaculty.photoAssetId;

    if (photoUrl && photoUrl !== currentFaculty.photo?.fileUrl) {
      const newPhoto = await prisma.asset.create({
        data: {
          title: `Photo of ${name}`,
          type: AssetType.FACULTY,
          fileUrl: photoUrl,
          mimeType: "image/jpeg",
          size: 0,
          admin: { connect: { id: admin.sub } }
        }
      });

      updatedPhotoAssetId = newPhoto.id;

      if (currentFaculty.photoAssetId) {
        await prisma.asset.delete({
          where: { id: currentFaculty.photoAssetId }
        });
      }
    }

    const faculty = await prisma.faculty.update({
      where: { id },
      data: {
        name,
        designation,
        bio,
        experience: parseInt(experience) || 0,
        categories: categories,
        photoAssetId: updatedPhotoAssetId 
      },
      include: { photo: true }
    });

    // 🟢 AUDIT LOG: Record faculty update
    await logActivity(
      admin.sub, 
      admin.username, 
      "UPDATE", 
      "FACULTY", 
      { id: faculty.id, title: faculty.name || "Updated Faculty" }
    );

    res.json({ success: true, faculty });
  } catch (error) {
    console.error("Update Faculty Error:", error);
    res.status(500).json({ message: "Failed to update profile professionally" });
  }
}

// ✅ PROFESSIONAL DELETE FACULTY
export async function deleteFaculty(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const admin = (req as any).user; // 🟢 Extract admin context

      const facultyToDelete = await prisma.faculty.findUnique({
        where: { id },
        select: { id: true, name: true, photoAssetId: true }
      });

      if (!facultyToDelete) {
        return res.status(404).json({ message: "Faculty member not found" });
      }

      await prisma.$transaction(async (tx) => {
        await tx.faculty.delete({
          where: { id }
        });

        if (facultyToDelete.photoAssetId) {
          await tx.asset.delete({
            where: { id: facultyToDelete.photoAssetId }
          });
        }
      });

      // 🟢 AUDIT LOG: Record faculty deletion
      await logActivity(
        admin.sub, 
        admin.username, 
        "DELETE", 
        "FACULTY", 
        { id: facultyToDelete.id, title: facultyToDelete.name || "Deleted Faculty" }
      );

      res.json({ success: true, message: "Faculty and associated assets deleted successfully" });
    } catch (error) {
      console.error("Delete Faculty Error:", error);
      res.status(500).json({ message: "Failed to delete faculty professionally" });
    }
}