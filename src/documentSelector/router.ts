import express from "express";
import {
  documentSelectorGetController,
  documentSelectorPostController,
} from "./controller";

const router = express.Router();

router.get("/select-document", documentSelectorGetController);
router.post("/select-document", documentSelectorPostController);

export { router as documentSelectorRouter };
