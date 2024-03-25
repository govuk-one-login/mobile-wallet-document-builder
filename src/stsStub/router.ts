import express from "express";
import { stsStubController } from "./controller";

const router = express.Router();

router.post("/sts-stub/token", stsStubController);

export { router as mockStsRouter };
