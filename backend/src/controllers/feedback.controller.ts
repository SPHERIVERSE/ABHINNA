import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { logActivity } from "../utils/logger"; // 🟢 Linked to Audit Trail

// ✅ PUBLIC: Submit Feedback
export async function submitFeedback(req: Request, res: Response) {
  try {
    const { name, comment, rating } = req.body;

    if (!name) return res.status(400).json({ message: "Name is mandatory" });

    const feedback = await prisma.feedback.create({
      data: {
        name,
        comment,
        rating: parseInt(rating) || 5,
      }
    });

    res.json({ success: true, message: "Thank you for your feedback!" });
  } catch (error) {
    res.status(500).json({ message: "Submission failed" });
  }
}

// ✅ ADMIN: Toggle Featured Status
export async function toggleFeedbackFeatured(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;
    const admin = (req as any).user; // From auth.middleware.ts

    const updated = await prisma.feedback.update({
      where: { id },
      data: { isFeatured }
    });

    // 🟢 AUDIT LOG: Record the management action
    await logActivity(
      admin.sub, 
      admin.username, 
      "UPDATE", 
      "SYSTEM", 
      { id: updated.id, title: `Featured feedback from ${updated.name}: ${isFeatured}` }
    );

    res.json({ success: true, feedback: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update feedback" });
  }
}

// Add this to your feedback.controller.ts
export async function getFeedbacks(req: Request, res: Response) {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({ 
      success: true, 
      feedbacks // 🟢 This key must match what the frontend expects
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
}

// ✅ ADMIN: Delete Feedback (In case of spam)
export async function deleteFeedback(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const admin = (req as any).user;

    const deleted = await prisma.feedback.delete({ where: { id } });

    await logActivity(
      admin.sub, 
      admin.username, 
      "DELETE", 
      "SYSTEM", 
      { id: deleted.id, title: `Deleted feedback from ${deleted.name}` }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete feedback" });
  }
}