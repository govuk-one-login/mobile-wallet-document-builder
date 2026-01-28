import express from "express";
import { dvsStartPageGetController } from "./controller";

const router = express.Router();

router.get("/dvs-start", dvsStartPageGetController());

export { router as dvsStartPageRouter };
