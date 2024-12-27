import { PhotoInputData } from "../types/PhotoInputData";
import { getNameParts } from "../../utils/getNameParts";
import { CredentialType } from "../../types/CredentialType";
import {CredentialSubject} from "../../types/CredentialSubject";
import {promises as fs} from "fs";
import {PhotoCredentialSubject} from "../types/PhotoCredentialSubject";
import path from "path";

export class PhotoDocument {
  public readonly type: string[];
  public readonly credentialSubject: CredentialSubject;

  constructor(type: string[], credentialSubject: PhotoCredentialSubject) {
    this.type = type;
    this.credentialSubject = credentialSubject;
  }

  /**
   * A static method for mapping a document's details into a document in the verifiable credential structure.
   *
   * @returns a document
   * @param input {PhotoInputData}
   * @param credentialType {CredentialType}
   */
  static async fromRequestBody(
    input: PhotoInputData,
    credentialType: CredentialType
  ): Promise<PhotoDocument> {
    this.trimRequestBody(input);

    const type = ["VerifiableCredential", credentialType];
    const credentialSubject: PhotoCredentialSubject = {
      name: [
        {
          nameParts: getNameParts(
            input.givenName,
            input.familyName,
            input.title
          ),
        },
      ],
      // photo: await this.readInPhoto(),
    };

    return new PhotoDocument(type, credentialSubject);
  }

  private static trimRequestBody(input: PhotoInputData) {
    for (const key in input) {
      const trimmed = input[key as keyof PhotoInputData]!.trim();
      input[key as keyof PhotoInputData] = trimmed;
    }
  }

  // private static async readInPhoto(): Promise<Buffer> {
  //     try {
  //       const data = await fs.readFile(path.resolve(__dirname, "./photo.jpg"));
  //       console.log(data);
  //       return data;
  //     } catch (error) {
  //       console.log(error);
  //       throw error;
  //     }
  // }
}
