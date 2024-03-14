import express from "express";
import { documentBuilderGet, documentBuilderPost } from "./controller";

const router = express.Router();

router.get("/build-document", documentBuilderGet);
router.post("/build-document", documentBuilderPost);

export { router as documentBuilderRouter };
