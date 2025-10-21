import express from "express";
import { refreshGetController, refreshPostController } from "./controller";
import { validateCredentialTypePath } from "../middleware/validateCredentialTypePath";

const router = express.Router();

router.get(
  "/refresh/:credentialType",
  validateCredentialTypePath,
  refreshGetController,
);
router.post(
  "/refresh/:credentialType",
  validateCredentialTypePath,
  refreshPostController,
);

export { router as refreshRouter };
