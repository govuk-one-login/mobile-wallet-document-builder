import express from "express";
import {
returnFromAuthGetController,
} from "./controller";

const router = express.Router();

router.get("/return-from-auth", returnFromAuthGetController);

export { router as returnFromAuthRouter };
