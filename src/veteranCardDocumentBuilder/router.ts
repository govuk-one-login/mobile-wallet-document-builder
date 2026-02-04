import express from "express";
import {
  veteranCardDocumentBuilderGetController,
  veteranCardDocumentBuilderPostController,
} from "./controller";
import { requiresAuth } from "../middleware/requiresAuth";
import { requiresAppSelected } from "../middleware/requiresAppSelected";

const router = express.Router();

router.get(
  "/build-veteran-card-document",
  requiresAuth,
  requiresAppSelected,
  veteranCardDocumentBuilderGetController(),
);
router.post(
  "/build-veteran-card-document",
  requiresAuth,
  requiresAppSelected,
  veteranCardDocumentBuilderPostController,
);

export { router as veteranCardDocumentBuilderRouter };
