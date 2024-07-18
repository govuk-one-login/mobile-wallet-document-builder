import express from "express";
import { stsStubJwksController } from "./controller";

const router = express.Router();

router.get("/sts-stub/.well-known/jwks.json", stsStubJwksController);

export { router as stsStubJwksRouter };
