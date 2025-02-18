import express from "express";
import {
  ninoDocumentBuilderGetController,
  ninoDocumentBuilderPostController,
} from "./controller";
import { requiresAuth } from "../middleware/requiresAuth";

const router = express.Router();

router.get(
  "/build-nino-document",
  requiresAuth,
  ninoDocumentBuilderGetController,
);
router.post(
  "/build-nino-document",
  requiresAuth,
  ninoDocumentBuilderPostController,
);

export { router as ninoDocumentBuilderRouter };
