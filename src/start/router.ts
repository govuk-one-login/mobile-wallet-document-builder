import express from "express";
import { startPageGetController } from "./controller";

const router = express.Router();

router.get("/start", startPageGetController());

export { router as startPageRouter };
