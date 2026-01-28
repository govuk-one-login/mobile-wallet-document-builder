import express from "express";
import {
  appSelectorGetController,
  appSelectorPostController,
} from "./controller";
import { canRenderRoute } from "../middleware/canRenderRoute";

const router = express.Router();

router.get("/select-app", canRenderRoute, appSelectorGetController());
router.post("/select-app", canRenderRoute, appSelectorPostController());

export { router as appSelectorRouter };
