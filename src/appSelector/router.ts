import express from "express";
import {
  appSelectorGetController,
  appSelectorPostController,
} from "./controller";
import { requiresAuth } from "../middleware/requiresAuth";
import { canRender } from "../middleware/canRender";

const router = express.Router();

router.get("/select-app", canRender, requiresAuth, appSelectorGetController());
router.post(
  "/select-app",
  canRender,
  requiresAuth,
  appSelectorPostController(),
);

export { router as appSelectorRouter };
