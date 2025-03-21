import { UUID } from "node:crypto";
import { NinoData } from "../ninoDocumentBuilder/types/NinoData";
import { DbsData } from "../dbsDocumentBuilder/types/DbsData";
import { VeteranCardData } from "../veteranCardDocumentBuilder/types/VeteranCardData";
import { CredentialType } from "./CredentialType";

export interface TableItem {
  documentId: UUID;
  data: NinoData | DbsData | VeteranCardData;
  vcType: CredentialType;
}
