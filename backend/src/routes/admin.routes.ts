import { Router } from "express";
import { adminLogin } from "../services/adminAuth.service";
import { setAuthCookie } from "../utils/cookies";
import { clearAuthCookie } from "../utils/cookies";
import { requireAdmin } from "../middleware/auth.middleware";
import { adminStatsController } from "../controllers/adminStats.controller";
import { createAsset, getAssets, updateAsset, deleteAsset } from "../controllers/assets.controller";
import { createCourse, getCourses, updateCourse, // 👈 Import these
  deleteCourse, toggleCourseStatus } from "../controllers/courses.controller";
import { createFaculty, getFaculty, deleteFaculty, updateFaculty } from "../controllers/faculty.controller";
import { 
  createNotification, 
  getNotifications, 
  toggleNotification, 
  deleteNotification 
} from "../controllers/notifications.controller";
import { createBatch, getBatches, updateBatch, deleteBatch } from "../controllers/batches.controller";
import { createVideo, getVideos, updateVideo, deleteVideo } from "../controllers/video.controller";
import { submitFeedback, toggleFeedbackFeatured, getFeedbacks, deleteFeedback } from "../controllers/feedback.controller"; 
import { getLogsController } from "../controllers/logs.controller";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const { admin, token } = await adminLogin(username, password);

    setAuthCookie(res, token);

    res.json({
      success: true,
      admin: { id: admin.id, username: admin.username, role: admin.role },
    });
  } catch (e: any) {
    res.status(401).json({ message: e.message });
  }
});

router.post("/logout", (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true });
});

router.get("/stats", requireAdmin, adminStatsController);
router.post("/assets", requireAdmin, createAsset);
router.get("/assets", requireAdmin, getAssets);
router.put("/assets/:id", requireAdmin, updateAsset); 
router.delete("/assets/:id", requireAdmin, deleteAsset);
router.post("/courses", requireAdmin, createCourse);
router.get("/courses", requireAdmin, getCourses);
router.put("/courses/:id", requireAdmin, updateCourse);  
router.delete("/courses/:id", requireAdmin, deleteCourse);
router.patch("/courses/:id/status", requireAdmin, toggleCourseStatus);
router.post("/faculty", requireAdmin, createFaculty);
router.get("/faculty", requireAdmin, getFaculty);
router.delete("/faculty/:id", requireAdmin, deleteFaculty);
router.put("/faculty/:id", requireAdmin, updateFaculty);
router.post("/notifications", requireAdmin, createNotification);
router.get("/notifications", requireAdmin, getNotifications);
router.patch("/notifications/:id", requireAdmin, toggleNotification);
router.delete("/notifications/:id", requireAdmin, deleteNotification);
router.post("/batches", requireAdmin, createBatch);
router.get("/batches", requireAdmin, getBatches);
router.put("/batches/:id", requireAdmin, updateBatch);
router.delete("/batches/:id", requireAdmin, deleteBatch);
router.post("/videos", requireAdmin, createVideo); 
router.get("/videos", requireAdmin, getVideos);
router.put("/videos/:id", requireAdmin, updateVideo);
router.delete("/videos/:id", requireAdmin, deleteVideo);
router.post("/feedback", requireAdmin, submitFeedback);
router.get("/feedback", requireAdmin, getFeedbacks);
router.patch("/feedback/:id/feature", requireAdmin, toggleFeedbackFeatured);
router.delete("/feedback/:id", requireAdmin, deleteFeedback);
router.get("/logs", requireAdmin, getLogsController);

export default router;

