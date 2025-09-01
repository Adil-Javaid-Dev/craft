// routes/clientRoutes.js
import express from "express";
import { ClientController } from "../controllers/client.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Client routes
router.post("/", ClientController.createClient);
router.get("/", ClientController.getClients);
router.get("/:id", ClientController.getClient);
router.put("/:id", ClientController.updateClient);
router.patch("/:id/status", ClientController.updateClientStatus);
router.delete("/:id", ClientController.deleteClient);

// Document routes
router.post(
  "/:id/documents/:documentType",
  upload.single("file"),
  ClientController.uploadDocument
);
router.get("/:id/documents/:documentType", ClientController.downloadDocument);

export default router;
