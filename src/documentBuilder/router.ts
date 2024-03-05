import express from "express";
import { documentBuilderGet, documentBuilderPost } from "./controller";

const router = express.Router();

router.get("/credential_offer", documentBuilderGet);
router.post("/credential_offer", documentBuilderPost);

export { router as documentBuilderRouter };
