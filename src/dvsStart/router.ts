import express from "express";
import { dvsStartGetController } from "./controller";

const router = express.Router();

router.get("/dvs-start", dvsStartGetController);

export { router as dvsStartRouter };
