import express from "express";
import { stsStubAccessTokenController } from "./controller";

const router = express.Router();

router.post("/sts-stub/token", stsStubAccessTokenController);

export { router as stsStubAccessTokenRouter };
