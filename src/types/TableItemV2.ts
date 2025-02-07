import { UUID } from "node:crypto";
import { NinoData } from "../ninoDocumentBuilder/types/NinoData";
import { DbsData } from "../dbsDocumentBuilder/types/DbsData";
import { VeteranCardData } from "../veteranCardDocumentBuilder/types/VeteranCardData";

export interface TableItemV2 {
  documentId: UUID;
  data: NinoData | DbsData | VeteranCardData;
  vcDataModel: string;
  vcType: string;
}
