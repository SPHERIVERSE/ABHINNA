import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { AssetType } from "@prisma/client";
import { logActivity } from "../utils/logger"; // 🟢 Import the new logger

export async function createAsset(req: Request, res: Response) {
  try {
    const { title, type, url, size, width, height, categoryGroup, subCategory, rank } = req.body;
    
    // 🟢 Extract the full user object for logging
    const admin = (req as any).user; 

    if (!title || !url || !type || !admin?.sub) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const asset = await prisma.asset.create({
      data: {
        title: title,
        type: type as AssetType,
        fileUrl: url,
        mimeType: "image/jpeg", 
        size: size || 0,       
        width: width || null,  
        height: height || null, 
        categoryGroup,
        subCategory,
        rank,
        admin: {
          connect: { id: admin.sub }
        }
      },
    });

    // 🟢 AUDIT LOG: Record asset creation
    await logActivity(
      admin.sub, 
      admin.username, 
      "CREATE", 
      "ASSET", 
      { id: asset.id, title: asset.title || "Untitled Asset" }
    );

    res.json({ success: true, asset });
  } catch (error) {
    console.error("Create Asset Error:", error);
    res.status(500).json({ message: "Failed to save asset" });
  }
}

export async function getAssets(req: Request, res: Response) {
  try {
    const assets = await prisma.asset.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, assets });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch assets" });
  }
}

export async function updateAsset(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, type, categoryGroup, subCategory, rank } = req.body;
    const admin = (req as any).user;

    const updated = await prisma.asset.update({
      where: { id },
      data: { 
        title, 
        type, 
        categoryGroup, 
        subCategory, 
        rank 
      },
    });

    // 🟢 AUDIT LOG: Record asset update
    await logActivity(
      admin.sub, 
      admin.username, 
      "UPDATE", 
      "ASSET", 
      { id: updated.id, title: updated.title || "Updated Asset" }
    );

    res.json({ success: true, asset: updated });
  } catch (error) {
    res.status(500).json({ message: "Professional update failed" });
  }
}

export async function deleteAsset(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const admin = (req as any).user;

    // Fetch the asset first to get the title for the log before it's deleted
    const assetToDelete = await prisma.asset.findUnique({ where: { id } });

    await prisma.$transaction(async (tx) => {
      await tx.asset.delete({
        where: { id },
      });
    });

    // 🟢 AUDIT LOG: Record asset deletion
    if (assetToDelete) {
      await logActivity(
        admin.sub, 
        admin.username, 
        "DELETE", 
        "ASSET", 
        { id: assetToDelete.id, title: assetToDelete.title || "Deleted Asset" }      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Failed to purge asset from database" });
  }
}