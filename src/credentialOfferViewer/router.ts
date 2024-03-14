import express from "express";
import { viewCredentialOffer } from "./controller";

const router = express.Router();

router.get("/view-credential-offer/:documentId", viewCredentialOffer);

export { router as credentialOfferViewerRouter };
