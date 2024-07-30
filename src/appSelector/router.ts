import express from "express";
import {
  appSelectorGetController,
  appSelectorPostController,
} from "./controller";

const router = express.Router();

router.get("/select-app", appSelectorGetController);
router.post("/select-app", appSelectorPostController);

export { router as appSelectorRouter };
