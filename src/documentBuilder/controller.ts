import { Request, Response } from "express";
import { Document } from "./documentBuilder";
import { saveDocumentToDatabase } from "../database/documentStore";
import { randomUUID } from "node:crypto";

export async function documentBuilderGet(
  req: Request,
  res: Response
): Promise<void> {
  console.log("documentBuilderGet");
  res.render("document-form.njk");
}

export async function documentBuilderPost(
  req: Request,
  res: Response
): Promise<void> {
  console.log("documentBuilderPost");

  const document = Document.fromRequestBody(req.body);
  console.log("Document created");

  const documentId = randomUUID();
  await saveDocumentToDatabase(document, documentId);

  res.render("document-id.njk", {
    documentId,
  });
}
