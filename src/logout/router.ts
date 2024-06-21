import express from "express";
import { logoutGetController } from "./controller";
import {requiresAuth} from "../middleware/requiresAuth";

const router = express.Router();

router.get("/logout", requiresAuth, logoutGetController);

export { router as logoutRouter };
