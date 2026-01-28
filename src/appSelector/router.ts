import express from "express";
import {
  appSelectorGetController,
  appSelectorPostController,
} from "./controller";
import { canRenderRoute } from "../middleware/canRenderRoute";
import { ROUTES } from "../config/routes";

const router = express.Router();

router.get(ROUTES.SELECT_APP, canRenderRoute, appSelectorGetController());
router.post(ROUTES.SELECT_APP, canRenderRoute, appSelectorPostController());

export { router as appSelectorRouter };
