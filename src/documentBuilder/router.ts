import express from "express";
import { documentBuilder } from "./controller";

const router = express.Router();

router.get("/hello-world", documentBuilder);

export { router as documentBuilderRouter };
