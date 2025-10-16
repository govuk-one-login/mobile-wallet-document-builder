import express from "express";
import { requiresAuth } from "../middleware/requiresAuth";
import { refreshGetController, refreshPostController } from "./controller";

const router = express.Router();

router.get("/refresh/:credentialType", requiresAuth, refreshGetController);
router.post("/refresh/:credentialType", requiresAuth, refreshPostController);

export { router as refreshRouter };
