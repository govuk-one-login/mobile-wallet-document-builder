import express from "express";
import { dvsPageGetController } from "./controller";
import { canRender } from "../middleware/canRender";

const router = express.Router();

router.get("/dvs", canRender, dvsPageGetController());

export { router as dvsPageRouter };
