import express from "express";
import { documentGet } from "./controller";

const router = express.Router();

router.get("/document/:documentId", documentGet);

export { router as documentDataRouter };
