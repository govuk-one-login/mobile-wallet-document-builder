import { UUID } from "node:crypto";
import { NinoData } from "../ninoDocumentBuilder/types/NinoData";
import { DbsData } from "../dbsDocumentBuilder/types/DbsData";
import { VeteranCardData } from "../veteranCardDocumentBuilder/types/VeteranCardData";
import { CredentialType } from "./CredentialType";
import { MdlData } from "../mdlDocumentBuilder/types/MdlData";
import { SimpleDocumentData } from "../simpleDocumentBuilder/types/SimpleDocumentData";

export interface TableItem {
  itemId: UUID;
  documentId: string;
  data: NinoData | DbsData | VeteranCardData | MdlData | SimpleDocumentData;
  vcType: CredentialType;
  credentialTtlMinutes: number;
  timeToLive: number;
}
