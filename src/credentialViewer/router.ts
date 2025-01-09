import express from "express";
import { credentialViewerController } from "./controller";
import { requiresAuth } from "../middleware/requiresAuth";

const router = express.Router();

router.get("/view-credential", requiresAuth, credentialViewerController);

export { router as credentialViewerRouter };
