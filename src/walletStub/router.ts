import express from "express";
import { walletStubController } from "./controller";

const router = express.Router();

router.get("/wallet-stub/:nonce", walletStubController);

export { router as walletStubRouter };
