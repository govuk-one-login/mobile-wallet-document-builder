import express from "express";
import {
  documentSelectorGetController,
  documentSelectorPostController,
} from "./controller";
import { requiresAuth } from "../middleware/requiresAuth";

const router = express.Router();

router.get("/select-document", requiresAuth, documentSelectorGetController());
router.post("/select-document", requiresAuth, documentSelectorPostController());

export { router as documentSelectorRouter };
