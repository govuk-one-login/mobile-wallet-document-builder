import { Request, Response } from "express";
import { getProofJwt } from "./proofJwt";

export async function proofJwtController(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { nonce } = req.params;

    const proofJwt = await getProofJwt(nonce);

    return res.status(200).json({proofJwt});
  } catch (error) {
    console.log(`An error happened: ${JSON.stringify(error)}`);
    return res.status(500).json({ error: "server_error" });
  }
}
