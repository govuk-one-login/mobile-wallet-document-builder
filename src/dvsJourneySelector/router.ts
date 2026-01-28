import express from "express";
import {
  dvsJourneySelectorGetController,
  dvsJourneySelectorPostController,
} from "./controller";

const router = express.Router();

router.get("/dvs/select-journey", dvsJourneySelectorGetController);
router.post("dvs//select-journey", dvsJourneySelectorPostController);

export { router as dvsJourneySelectorRouter };
