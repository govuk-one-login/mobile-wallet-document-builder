import express from "express";
import { loggedOutGetController } from "./controller";

const router = express.Router();

router.get("/logged-out", loggedOutGetController);

export { router as loggedOutRouter };
