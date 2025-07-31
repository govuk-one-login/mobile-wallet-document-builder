import express from "express";
import { proofJwtController } from "./controller";

const router = express.Router();

router.get("/proof-jwt", proofJwtController);

export { router as proofJwtRouter };
