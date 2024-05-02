import express from "express";
import {
  dbsDocumentBuilderGetController,
  dbsDocumentBuilderPostController,
} from "./controller";

const router = express.Router();

router.get("/build-dbs-document", dbsDocumentBuilderGetController);
router.post("/build-dbs-document", dbsDocumentBuilderPostController);

export { router as dbsDocumentBuilderRouter };
