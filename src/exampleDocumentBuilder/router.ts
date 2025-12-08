import { requiresAuth } from "../middleware/requiresAuth";
import express from "express";
import {
  exampleDocumentBuilderGetController,
  exampleDocumentBuilderPostController,
} from "./controller";

const router = express.Router();

router.get(
  "/build-example-document",
  requiresAuth,
  exampleDocumentBuilderGetController,
);
router.post(
  "/build-example-document",
  requiresAuth,
  exampleDocumentBuilderPostController,
);

export { router as exampleDocumentBuilderRouter };
