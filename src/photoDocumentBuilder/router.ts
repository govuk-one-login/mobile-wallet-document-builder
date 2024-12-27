import express from "express";
import {
  photoDocumentBuilderGetController,
  photoDocumentBuilderPostController,
} from "./controller";
import { requiresAuth } from "../middleware/requiresAuth";

const router = express.Router();

router.get(
  "/build-photo-document",
  requiresAuth,
  photoDocumentBuilderGetController
);
router.post(
  "/build-photo-document",
  requiresAuth,
  photoDocumentBuilderPostController
);

export { router as photoDocumentBuilderRouter };
