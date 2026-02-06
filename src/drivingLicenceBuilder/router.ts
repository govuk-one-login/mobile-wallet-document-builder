import express from "express";
import {
  drivingLicenceBuilderGetController,
  drivingLicenceBuilderPostController,
} from "./controller";
import { requiresAuth } from "../middleware/requiresAuth";
import { requiresAppSelected } from "../middleware/requiresAppSelected";

const router = express.Router();

router.get(
  "/build-driving-licence",
  requiresAuth,
  requiresAppSelected,
  drivingLicenceBuilderGetController(),
);
router.post(
  "/build-driving-licence",
  requiresAuth,
  requiresAppSelected,
  drivingLicenceBuilderPostController(),
);

export { router as drivingLicenceBuilderRouter };
