import express from "express";
import {
  documentBuilderGetController,
  documentBuilderPostController,
} from "./controller";

const router = express.Router();

router.get("/build-document", documentBuilderGetController);
router.post("/build-document", documentBuilderPostController);

export { router as documentBuilderRouter };
