import express from "express";
import {
  appSelectorGetController,
  appSelectorPostController,
} from "./controller";
import { requiresAuth } from "../middleware/requiresAuth";

const router = express.Router();

router.get("/select-app", requiresAuth, appSelectorGetController());
router.post("/select-app", requiresAuth, appSelectorPostController());

export { router as appSelectorRouter };
