import { requiresAuth } from "../middleware/requiresAuth";
import express from "express";
import {
  fishingLicenceDocumentBuilderGetController,
  fishingLicenceDocumentBuilderPostController,
} from "./controller";

const router = express.Router();

router.get(
  "/build-fishing-licence-document",
  requiresAuth,
  fishingLicenceDocumentBuilderGetController,
);
router.post(
  "/build-fishing-licence-document",
  requiresAuth,
  fishingLicenceDocumentBuilderPostController,
);

export { router as fishingLicenceDocumentBuilderRouter };
