import { UUID } from "node:crypto";
import { NinoData } from "../ninoDocumentBuilder/types/NinoData";
import { DbsData } from "../dbsDocumentBuilder/types/DbsData";
import { VeteranCardData } from "../veteranCardDocumentBuilder/types/VeteranCardData";
import { CredentialType } from "./CredentialType";
import { MdlData } from "../mdlDocumentBuilder/types/MdlData";
import { ExampleDocumentData } from "../exampleDocumentBuilder/types/ExampleDocumentData";

export interface TableItem {
  itemId: UUID;
  documentId: string;
  data: NinoData | DbsData | VeteranCardData | MdlData | ExampleDocumentData;
  vcType: CredentialType;
  credentialTtlMinutes: number;
  timeToLive: number;
}
