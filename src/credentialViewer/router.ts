import express from "express";
import { credentialViewerController } from "./controller";
import { requiresAuth } from "../middleware/requiresAuth";
import { requiresAppSelected } from "../middleware/requiresAppSelected";

const router = express.Router();

router.get(
  "/view-credential",
  requiresAuth,
  requiresAppSelected,
  credentialViewerController,
);

export { router as credentialViewerRouter };
