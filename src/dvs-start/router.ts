import express from "express";
import { dvsStartPageGetController } from "./controller";
import { canRenderRoute } from "../middleware/canRenderRoute";

const router = express.Router();

router.get("/dvs-start", canRenderRoute, dvsStartPageGetController());

export { router as dvsStartPageRouter };
