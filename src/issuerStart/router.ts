import express from "express";
import { issuerStartGetController } from "./controller";

const router = express.Router();

router.get("/start", issuerStartGetController);

export { router as issuerStartRouter };
