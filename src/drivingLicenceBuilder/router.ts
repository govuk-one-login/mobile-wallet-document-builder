import express from "express";
import {
  drivingLicenceBuilderGetController,
  drivingLicenceBuilderPostController,
} from "./controller";
import { requiresAuth } from "../middleware/requiresAuth";

const router = express.Router();

router.get(
  "/build-driving-licence",
  requiresAuth,
  drivingLicenceBuilderGetController(),
);
router.post(
  "/build-driving-licence",
  requiresAuth,
  drivingLicenceBuilderPostController(),
);

export { router as drivingLicenceBuilderRouter };
