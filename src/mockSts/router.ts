import express from "express";
import { mockStsController } from "./controller";

const router = express.Router();

router.post("/sts-stub/token", mockStsController);

export { router as mockStsRouter };
