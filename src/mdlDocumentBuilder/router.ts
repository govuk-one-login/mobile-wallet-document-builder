import express from "express";
import {
    mdlDocumentBuilderGetController,
    mdlDocumentBuilderPostController
} from "./controller";
import { requiresAuth } from "../middleware/requiresAuth";

const router = express.Router();

router.get(
    "/build-mdl-document",
    requiresAuth,
    mdlDocumentBuilderGetController,
);
router.post(
    "/build-mdl-document",
    requiresAuth,
    mdlDocumentBuilderPostController,
);

export { router as mdlDocumentBuilderRouter };