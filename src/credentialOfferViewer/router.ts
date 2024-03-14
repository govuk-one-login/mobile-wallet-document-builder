import express from "express";
import { credentialOfferViewerController } from "./controller";

const router = express.Router();

router.get(
  "/view-credential-offer/:documentId",
  credentialOfferViewerController
);

export { router as credentialOfferViewerRouter };
