import express from "express";
import {
  refreshGetController,
  refreshNoUpdateGetController,
  refreshPostController,
} from "./controller";
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
router.get(
  "/refresh/:credentialType/no-update",
  validateCredentialTypePath,
  refreshNoUpdateGetController,
);

export { router as refreshRouter };
