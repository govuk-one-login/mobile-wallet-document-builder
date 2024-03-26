import { Request, Response } from "express";
import { getDidController, getStsSigningKeyId } from "../config/appConfig";
import { KmsService } from "../services/kmsService";
import { DidDocumentGenerator } from "./did/didDocumentGenerator";

export async function stsStubDidDocumentController(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const didController = getDidController();
    const keyId = getStsSigningKeyId();
    const kmsService = new KmsService(keyId);

    const didDocument = await new DidDocumentGenerator(
      kmsService,
      keyId,
      didController
    ).run();

    return res.status(200).json(didDocument);
  } catch (error) {
    console.log(`An error happened: ${JSON.stringify(error)}`);
    return res.status(500).json({ error: "server_error" });
  }
}
