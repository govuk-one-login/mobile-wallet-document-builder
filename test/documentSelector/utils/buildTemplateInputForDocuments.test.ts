import { buildTemplateInputForDocuments } from "../../../src/documentSelector/utils/buildTemplateInputForDocuments";

describe("buildTemplateInputForDocuments", () => {
  it("should build array of objects containing 'value' and 'text' from input config and return it", () => {
    const inputConfig = {
      SocialSecurityCredential: {
        route: "/build-nino-document",
        name: "NINO",
      },
      BasicDisclosureCredential: {
        route: "/build-dbs-document",
        name: "DBS",
      },
      DigitalVeteranCard: {
        route: "/build-veteran-card-document",
        name: "Veteran Card",
      },
      MobileDrivingLicence: {
        route: "/build-mdl-document",
        name: "Driving Licence",
      },
    };

    const expectedOutput = [
      { value: "SocialSecurityCredential", text: "NINO" },
      { value: "BasicDisclosureCredential", text: "DBS" },
      { value: "DigitalVeteranCard", text: "Veteran Card" },
      { value: "MobileDrivingLicence", text: "Driving Licence" },
    ];

    const result = buildTemplateInputForDocuments(inputConfig);

    expect(result).toEqual(expectedOutput);
  });
});
