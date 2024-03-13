import { Request, Response } from "express";
import { getDocument } from "../database/documentStore";

export async function documentDataGet(
  req: Request,
  res: Response
): Promise<Response> {
  const { documentId } = req.params;

  const databaseItem = await getDocument(documentId);

  if (!databaseItem) {
    return res.status(204).send();
  }

  const documentString = databaseItem.vc as string;
  const document = JSON.parse(documentString) as Document;

  return res.status(200).json(document);
}
