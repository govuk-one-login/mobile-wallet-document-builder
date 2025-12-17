import { requiresAuth } from "../middleware/requiresAuth";
import express from "express";
import {
  simpleDocumentBuilderGetController,
  simpleDocumentBuilderPostController,
} from "./controller";

const router = express.Router();

router.get(
  "/build-simple-document",
  requiresAuth,
  simpleDocumentBuilderGetController(),
);
router.post(
  "/build-simple-document",
  requiresAuth,
  simpleDocumentBuilderPostController,
);

export { router as simpleDocumentBuilderRouter };
