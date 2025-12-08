import express from "express";
import {
  dbsDocumentBuilderGetController,
  dbsDocumentBuilderPostController,
} from "./controller";
import { requiresAuth } from "../middleware/requiresAuth";

const router = express.Router();

router.get(
  "/build-dbs-document",
  requiresAuth,
  dbsDocumentBuilderGetController(),
);
router.post(
  "/build-dbs-document",
  requiresAuth,
  dbsDocumentBuilderPostController,
);

export { router as dbsDocumentBuilderRouter };
