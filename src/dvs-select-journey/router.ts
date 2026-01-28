import express from "express";
import {
  dvsSelectJourneyGetController,
  dvsSelectJourneyPostController,
} from "./controller";
import { canRenderRoute } from "../middleware/canRenderRoute";
import { ROUTES } from "../config/routes";

const router = express.Router();

router.get(
  ROUTES.DVS_SELECT_JOURNEY,
  canRenderRoute,
  dvsSelectJourneyGetController(),
);

router.post(
  ROUTES.DVS_SELECT_JOURNEY,
  canRenderRoute,
  dvsSelectJourneyPostController(),
);

export { router as dvsSelectJourneyRouter };
