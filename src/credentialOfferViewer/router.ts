import express from "express";
import { credentialOfferViewerController } from "./controller";

const router = express.Router();

router.get("/view-credential-offer", credentialOfferViewerController);

export { router as credentialOfferViewerRouter };
