import { Request, Response } from "express";

export async function documentData(req: Request, res: Response): Promise<void> {
  const documentData = { id: "test" }; // call to DynamoDB to get document data
  res.status(200).json(documentData);
}
