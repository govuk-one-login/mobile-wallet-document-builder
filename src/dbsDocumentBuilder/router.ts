import express from "express";
import {
  dbsDocumentBuilderGetController,
  dbsDocumentBuilderPostController,
} from "./controller";
import { requiresAuth } from "../middleware/requiresAuth";
import { requiresAppSelected } from "../middleware/requiresAppSelected";

const router = express.Router();

router.get(
  "/build-dbs-document",
  requiresAuth,
  requiresAppSelected,
  dbsDocumentBuilderGetController(),
);
router.post(
  "/build-dbs-document",
  requiresAuth,
  requiresAppSelected,
  dbsDocumentBuilderPostController,
);

export { router as dbsDocumentBuilderRouter };
