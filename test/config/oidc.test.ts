import { getOIDCConfig } from "../../src/config/oidc";

process.env.OIDC_PRIVATE_KEY =
  "MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAqPfgaTEWEP3S9w0tgsicURfo+nLW09/0KfOPinhYZ4ouzU+3xC4pSlEp8Ut9FgL0AgqNslNaK34Kq+NZjO9DAQIDAQABAkAgkuLEHLaqkWhLgNKagSajeobLS3rPT0Agm0f7k55FXVt743hwNgkp98bMNrzy9AQ1mJGbQZGrpr4c8ZAx3aRNAiEAoxK/MgGeeLui385KJ7ZOYktjhLBNAB69fKwTZFsUNh0CIQEJQRpFCcydunv2bENcN/oBTRw39E8GNv2pIcNxZkcbNQIgbYSzn3Py6AasNj6nEtCfB+i1p3F35TK/87DlPSrmAgkCIQDJLhFoj1gbwRbH/bDRPrtlRUDDx44wHoEhSDRdy77eiQIgE6z/k6I+ChN1LLttwX0galITxmAYrOBhBVl433tgTTQ=";
process.env.OIDC_CLIENT_ID = "test-client-id";
process.env.OIDC_ISSUER_DISCOVERY_ENDPOINT = "http://localhost:8000";
process.env.BASE_URL = "http://localhost:3000";

describe("oidc.ts", () => {
  it("should return the OIDC configuration", () => {
    const response = getOIDCConfig();
    expect(response).toEqual({
      clientId: "test-client-id",
      discoveryEndpoint: "http://localhost:8000",
      privateKey:
        "MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAqPfgaTEWEP3S9w0tgsicURfo+nLW09/0KfOPinhYZ4ouzU+3xC4pSlEp8Ut9FgL0AgqNslNaK34Kq+NZjO9DAQIDAQABAkAgkuLEHLaqkWhLgNKagSajeobLS3rPT0Agm0f7k55FXVt743hwNgkp98bMNrzy9AQ1mJGbQZGrpr4c8ZAx3aRNAiEAoxK/MgGeeLui385KJ7ZOYktjhLBNAB69fKwTZFsUNh0CIQEJQRpFCcydunv2bENcN/oBTRw39E8GNv2pIcNxZkcbNQIgbYSzn3Py6AasNj6nEtCfB+i1p3F35TK/87DlPSrmAgkCIQDJLhFoj1gbwRbH/bDRPrtlRUDDx44wHoEhSDRdy77eiQIgE6z/k6I+ChN1LLttwX0galITxmAYrOBhBVl433tgTTQ=",
      redirectUri: "http://localhost:3000/return-from-auth",
    });
  });

  // it("should return the OIDC client", async () => {
  //     const config = getOIDCConfig();
  //     const response = await getOIDCClient(config);
  //     expect(response).toEqual({
  //         "clientId": "test-client-id",
  //         "discoveryEndpoint": "test-discovery-endpoint",
  //         "privateKey": "test-private-key",
  //         "redirectUri": "test-url/return-from-auth"
  //     })
  // })
});
