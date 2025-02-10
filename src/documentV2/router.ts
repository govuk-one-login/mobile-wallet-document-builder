import express from "express";
import { documentController } from "./controller";

const router = express.Router();

router.get("/v2/document/:documentId", documentController);

export { router as documentRouter };
