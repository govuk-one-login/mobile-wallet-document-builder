import express from "express";
import { stsStubDidDocumentController } from "./controller";

const router = express.Router();

router.get("/sts-stub/.well-known/did.json", stsStubDidDocumentController);

export { router as stsStubDidDocumentRouter };
