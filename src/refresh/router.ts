import express from "express";
import { refreshGetController, refreshPostController } from "./controller";
import { validateCredentialType } from "../middleware/validateCredentialType";

const router = express.Router();

router.get(
  "/refresh/:credentialType",
  validateCredentialType,
  refreshGetController,
);
router.post(
  "/refresh/:credentialType",
  validateCredentialType,
  refreshPostController,
);

export { router as refreshRouter };
