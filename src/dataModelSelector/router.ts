import express from "express";
import {
  dataModelSelectorGetController,
  dataModelSelectorPostController,
} from "./controller";
import { requiresAuth } from "../middleware/requiresAuth";

const router = express.Router();

router.get(
  "/select-vc-data-model",
  requiresAuth,
  dataModelSelectorGetController,
);
router.post(
  "/select-vc-data-model",
  requiresAuth,
  dataModelSelectorPostController(),
);

export { router as dataModelSelectorRouter };
