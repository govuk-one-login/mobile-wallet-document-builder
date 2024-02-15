import express from "express";
import { documentData } from "./controller";

const router = express.Router();

router.get("/document", documentData);

export { router as documentDataRouter };
