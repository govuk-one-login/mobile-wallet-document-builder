import express from "express";
import { noUpdateGetController } from "./controller";

const router = express.Router();

router.get("/no-update", noUpdateGetController);

export { router as noUpdateRouter };
