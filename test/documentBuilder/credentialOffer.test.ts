process.env.MOCK_CRI_URL = "http://localhost:1234";
import {getCredentialOffer} from "../../src/documentBuilder/credentialOffer";
import axios from "axios";

jest.mock('axios');
describe("credentialOffer.ts", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockedAxios = axios as jest.Mocked<typeof axios>;

  it("should render the credential offer", async () => {
    const walletSubjectId = "walletSubjectIdPlaceholder";
    const documentId = "2e0fac05-4b38-480f-9cbd-b046eabe1e46";

      const criResponseMocked = {
        data: {
          credential_offer_uri:
            "https://mobile.test.account.gov.uk/wallet/add?credential_offer=testCredentialOffer",
        },
      };

      mockedAxios.get.mockResolvedValue(criResponseMocked);

      await getCredentialOffer(walletSubjectId, documentId);

      expect(mockedAxios.get).toHaveBeenCalledWith({
        title: "Ms",
        givenName: "Irene",
        familyName: "Adler",
        nino: "QQ123456A",
      });
      // expect(saveDocument).toHaveBeenCalledWith(
      //   document,
      //   documentId,
      //   walletSubjectId
      // );
      // expect(response.render).toHaveBeenCalledWith("credential-offer.njk", {
      //   qrCode: qrCodeMocked,
      //   universalLink:
      //     "https://mobile.test.account.gov.uk/wallet/add?credential_offer=testCredentialOffer",
      // });
    });

    // it("should throw a DYNAMODB_ERROR error", async () => {
    //   const req = {
    //     body: {
    //       title: "Ms",
    //       givenName: "Irene",
    //       familyName: "Adler",
    //       nino: "QQ123456A",
    //     },
    //   } as unknown as Request;
    //
    //   const res = { render: jest.fn() } as unknown as Response;
    //
    //   const document = {
    //     type: "testType",
    //     credentialSubject: "testCredentialSubject",
    //   } as unknown as Document;
    //
    //   jest.spyOn(Document, "fromRequestBody").mockReturnValue(document);
    //   const saveDocument = documentStore.saveDocument as jest.Mock;
    //   saveDocument.mockRejectedValueOnce(new Error("DYNAMODB_ERROR"));
    //
    //   await expect(documentBuilderPost(req, res)).rejects.toThrow(
    //     "DYNAMODB_ERROR"
    //   );
    //
    //   expect(Document.fromRequestBody).toHaveBeenCalledWith({
    //     title: "Ms",
    //     givenName: "Irene",
    //     familyName: "Adler",
    //     nino: "QQ123456A",
    //   });
    //   expect(saveDocument).toHaveBeenCalledWith(
    //     { credentialSubject: "testCredentialSubject", type: "testType" },
    //     "2e0fac05-4b38-480f-9cbd-b046eabe1e46"
    //   );
    //   expect(res.render).not.toHaveBeenCalled();
    // });
});
