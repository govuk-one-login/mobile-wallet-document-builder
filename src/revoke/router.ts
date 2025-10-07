import express from "express";
import { revokeGetController, revokePostController } from "./controller";

const router = express.Router();

router.get("/revoke", revokeGetController);
router.post("/revoke", revokePostController);

export { router as revokeRouter };
