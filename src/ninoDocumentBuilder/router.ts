import express from "express";
import {
  ninoDocumentBuilderGetController,
  ninoDocumentBuilderPostController,
} from "./controller";
import { requiresAuth } from "../middleware/requiresAuth";
import { requiresAppSelected } from "../middleware/requiresAppSelected";

const router = express.Router();

router.get(
  "/build-nino-document",
  requiresAuth,
  requiresAppSelected,
  ninoDocumentBuilderGetController(),
);
router.post(
  "/build-nino-document",
  requiresAuth,
  requiresAppSelected,
  ninoDocumentBuilderPostController,
);

export { router as ninoDocumentBuilderRouter };
