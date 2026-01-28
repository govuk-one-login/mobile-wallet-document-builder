import express from "express";
import { credentialOfferViewerController } from "./controller";
import { requiresAuth } from "../middleware/requiresAuth";
import { ROUTES } from "../config/routes";

const router = express.Router();

router.get(
  ROUTES.CREDENTIAL_OFFER_VIEWER,
  requiresAuth,
  credentialOfferViewerController(),
);

export { router as credentialOfferViewerRouter };
