import express from "express";
import { credentialOfferViewerController } from "./controller";
import { requiresAuth } from "../middleware/requiresAuth";
import { requiresAppSelected } from "../middleware/requiresAppSelected";

const router = express.Router();

router.get(
  "/view-credential-offer/:itemId",
  requiresAuth,
  requiresAppSelected,
  credentialOfferViewerController(),
);

export { router as credentialOfferViewerRouter };
