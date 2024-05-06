import { Request, Response } from "express";
import { getDocument } from "../services/databaseService";
import { logger } from "../utils/logger";
import {NinoDocument} from "../ninoDocumentBuilder/models/ninoDocument";
import {DbsDocument} from "../dbsDocumentBuilder/models/dbsDocument";

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
    const document: NinoDocument | DbsDocument = JSON.parse(documentString);

    return res.status(200).json(document);
  } catch (error) {
    logger.error(error, "An error happened processing request to get document");
    return res.status(500).send();
  }
}
