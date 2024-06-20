import express from "express";
import { logoutPostController } from "./controller";

const router = express.Router();

router.get("/logout", logoutPostController);

export { router as logoutRouter };