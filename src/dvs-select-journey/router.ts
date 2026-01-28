import express from "express";
import {
  dvsSelectJourneyGetController,
  dvsSelectJourneyPostController,
} from "./controller";
import { canRenderRoute } from "../middleware/canRenderRoute";

const router = express.Router();

router.get(
  "/dvs-select-journey",
  canRenderRoute,
  dvsSelectJourneyGetController(),
);

router.post(
  "/dvs-select-journey",
  canRenderRoute,
  dvsSelectJourneyPostController(),
);

export { router as dvsSelectJourneyRouter };
