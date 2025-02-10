import { UUID } from "node:crypto";

export interface TableItemV1 {
  documentId: UUID;
  vc: string;
}
