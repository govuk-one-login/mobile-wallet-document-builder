import { NinoInputData } from "../ninoDocumentBuilder/types/NinoInputData";
import { DbsInputData } from "../dbsDocumentBuilder/types/DbsInputData";
import { VeteranCardInputData } from "../veteranCardDocumentBuilder/types/VeteranCardInputData";

export function trimRequestBody(
  input: NinoInputData | DbsInputData | VeteranCardInputData
) {
  for (const key in input) {
    const trimmed = input[key as keyof typeof input].trim();
    input[key as keyof typeof input] = trimmed;
  }
}
