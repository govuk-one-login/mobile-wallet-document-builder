import express from "express";
import { logoutGetController } from "./controller";
import { requiresAuth } from "../middleware/requiresAuth";
import { requiresAppSelected } from "../middleware/requiresAppSelected";

const router = express.Router();

router.get("/logout", requiresAuth, requiresAppSelected, logoutGetController());

export { router as logoutRouter };
