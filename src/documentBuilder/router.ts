import express from "express";
import {
  documentBuilderSelectAppGetController,
  documentBuilderSelectAppPostController,
  documentBuilderBuildDocumentGetController,
  documentBuilderBuildDocumentPostController,
} from "./controller";

const router = express.Router();

router.get("/select-app", documentBuilderSelectAppGetController);
router.post("/select-app", documentBuilderSelectAppPostController);
router.get("/build-document", documentBuilderBuildDocumentGetController);
router.post("/build-document", documentBuilderBuildDocumentPostController);

export { router as documentBuilderRouter };
