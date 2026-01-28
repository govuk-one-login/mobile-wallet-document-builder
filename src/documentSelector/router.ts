import express from "express";
import {
  documentSelectorGetController,
  documentSelectorPostController,
} from "./controller";
import { requiresAuth } from "../middleware/requiresAuth";
import { canRenderRoute } from "../middleware/canRenderRoute";

const router = express.Router();

router.get("/select-document", canRenderRoute, documentSelectorGetController());
router.post("/select-document", requiresAuth, documentSelectorPostController());

export { router as documentSelectorRouter };
