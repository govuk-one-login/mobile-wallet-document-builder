import express from "express";
import {
  documentSelectorGetController,
  documentSelectorPostController,
} from "./controller";
import { requiresAuth } from "../middleware/requiresAuth";
import { requiresAppSelected } from "../middleware/requiresAppSelected";

const router = express.Router();

router.get(
  "/select-document",
  requiresAppSelected,
  requiresAuth,
  documentSelectorGetController(),
);
router.post(
  "/select-document",
  requiresAppSelected,
  requiresAuth,
  documentSelectorPostController(),
);

export { router as documentSelectorRouter };
