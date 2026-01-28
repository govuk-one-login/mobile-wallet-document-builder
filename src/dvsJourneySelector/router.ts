import express from "express";
import {
  dvsJourneySelectorGetController,
  dvsJourneySelectorPostController,
} from "./controller";

const router = express.Router();

router.get("/select-journey", dvsJourneySelectorGetController);
router.post("/select-journey", dvsJourneySelectorPostController);

export { router as dvsJourneySelectorRouter };
