import express from "express";
import { startGetController } from "./controller";

const router = express.Router();

router.get("/start", startGetController);

export { router as startRouter };
