import express from "express";
import {
  ninoDocumentBuilderGetController,
  ninoDocumentBuilderPostController,
} from "./controller";

const router = express.Router();

router.get("/build-nino-document", ninoDocumentBuilderGetController);
router.post("/build-nino-document", ninoDocumentBuilderPostController);

export { router as ninoDocumentBuilderRouter };
