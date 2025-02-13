import express from "express";
import {
  veteranCardDocumentBuilderGetController,
  veteranCardDocumentBuilderPostController,
} from "./controller";
import { requiresAuth } from "../middleware/requiresAuth";

const router = express.Router();

router.get(
  "/build-veteran-card-document",
  requiresAuth,
  veteranCardDocumentBuilderGetController,
);
router.post(
  "/build-veteran-card-document",
  requiresAuth,
  veteranCardDocumentBuilderPostController,
);

export { router as veteranCardDocumentBuilderRouter };
