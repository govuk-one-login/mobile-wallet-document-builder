import express from "express";
import { refreshGetController, refreshPostController } from "./controller";

const router = express.Router();

router.get("/refresh/:credentialType", refreshGetController);
router.post("/refresh/:credentialType", refreshPostController);

export { router as refreshRouter };
