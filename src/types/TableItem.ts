import { UUID } from "node:crypto";
import { NinoData } from "../ninoDocumentBuilder/types/NinoData";
import { DbsData } from "../dbsDocumentBuilder/types/DbsData";
import { VeteranCardData } from "../veteranCardDocumentBuilder/types/VeteranCardData";
import { CredentialType } from "./CredentialType";
import { MdlData } from "../mdlDocumentBuilder/types/MdlData";

export interface TableItem {
  documentId: UUID;
  data: NinoData | DbsData | VeteranCardData | MdlData;
  vcType: CredentialType;
}
