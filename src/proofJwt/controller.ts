import { Request, Response } from "express";
import { getProofJwt } from "./proofJwt";
import { getStsSigningKeyId } from "../config/appConfig";

export async function proofJwtController(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { nonce, audience } = req.query;

    const proofJwt = await getProofJwt(
      nonce as string,
      audience as string,
      getStsSigningKeyId() // use the existing mock STS signing key to avoid creating a new KMS key
    );

    return res.status(200).json({ proofJwt });
  } catch (error) {
    console.log(`An error happened: ${JSON.stringify(error)}`);
    return res.status(500).json({ error: "server_error" });
  }
}
