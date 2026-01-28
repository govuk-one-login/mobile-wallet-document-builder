import express from "express";
import { dvsStartPageGetController } from "./controller";
import { canRenderRoute } from "../middleware/canRenderRoute";
import { ROUTES } from "../config/routes";

const router = express.Router();

router.get(ROUTES.DVS_START, canRenderRoute, dvsStartPageGetController());

export { router as dvsStartPageRouter };
