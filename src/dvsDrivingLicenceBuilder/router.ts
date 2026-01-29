import express from "express";
import { dvsDrivingLicenceBuilderGetController } from "./controller";

const router = express.Router();

router.get("/dvs/build-driving-licence", dvsDrivingLicenceBuilderGetController);

export { router as dvsDrivingLicenceBuilderRouter };
