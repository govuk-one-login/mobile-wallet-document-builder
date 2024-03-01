import express from "express";
import { documentBuilderGet, documentBuilderPost } from "./controller";
import { body } from "express-validator";

const router = express.Router();

router.get("/credential_offer", documentBuilderGet);
router.post(
  "/credential_offer",
  [
    body("title").trim(),
    body("givenName").trim(),
    body("familyName").trim(),
    body("nino").trim(),
  ],
  documentBuilderPost
);

export { router as documentBuilderRouter };
