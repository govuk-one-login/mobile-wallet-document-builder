import express from "express";
import { logoutGetController } from "./controller";

const router = express.Router();

router.get("/logout", logoutGetController);

export { router as logoutRouter };
