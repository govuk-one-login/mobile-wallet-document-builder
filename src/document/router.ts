import express from "express";
import { documentController } from "./controller";

const router = express.Router();

router.get("/document/:itemId", documentController);

export { router as documentRouter };
