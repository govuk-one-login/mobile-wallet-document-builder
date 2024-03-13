import { Request, Response } from "express";

export async function documentDataGet(
  req: Request,
  res: Response
): Promise<void> {
  const {documentId} = req.params;


  res.status(200).json(documentId);
}
