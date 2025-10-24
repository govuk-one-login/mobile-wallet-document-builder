import express from "express";
import { credentialOfferViewerController } from "./controller";
import { requiresAuth } from "../middleware/requiresAuth";

const router = express.Router();

router.get(
  "/view-credential-offer/:itemId",
  requiresAuth,
  credentialOfferViewerController(),
);

export { router as credentialOfferViewerRouter };
