import { requiresAuth } from "../middleware/requiresAuth";
import { requiresAppSelected } from "../middleware/requiresAppSelected";
import express from "express";
import {
  simpleDocumentBuilderGetController,
  simpleDocumentBuilderPostController,
} from "./controller";

const router = express.Router();

router.get(
  "/build-simple-document",
  requiresAuth,
  requiresAppSelected,
  simpleDocumentBuilderGetController(),
);
router.post(
  "/build-simple-document",
  requiresAuth,
  requiresAppSelected,
  simpleDocumentBuilderPostController(),
);

export { router as simpleDocumentBuilderRouter };
