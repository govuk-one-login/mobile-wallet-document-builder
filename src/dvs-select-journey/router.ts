import express from "express";
import { dvsSelectJourneyGetController } from "./controller";
// import { canRender } from "../middleware/canRender";

const router = express.Router();

router.get("/dvs-select-journey", dvsSelectJourneyGetController());

export { router as dvsSelectJourneyRouter };
