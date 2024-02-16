import express from "express";
import { documentDataGet } from "./controller";

const router = express.Router();

router.get("/document", documentDataGet);

export { router as documentDataRouter };
