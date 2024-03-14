import { Request, Response } from "express";
import { getDocument } from "../services/databaseService";

export async function documentController(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { documentId } = req.params;

    const databaseItem = await getDocument(documentId);
    if (!databaseItem) {
      return res.status(204).send();
    }

    const documentString = databaseItem.vc as string;
    const document = JSON.parse(documentString) as Document;

    return res.status(200).json(document);
  } catch (error) {
    console.log(`An error happened: ${JSON.stringify(error)}`);
    return res.status(500).send();
  }
}
