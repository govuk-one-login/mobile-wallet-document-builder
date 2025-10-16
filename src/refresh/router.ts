import express from "express";
import { requiresAuth } from "../middleware/requiresAuth";
import { refreshGetController } from "./controller";

const router = express.Router();

router.get("/refresh/:credentialType", requiresAuth, refreshGetController);

export { router as refreshRouter };
