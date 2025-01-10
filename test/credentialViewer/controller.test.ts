process.env.SELF = "http://localhost:8001";
process.env.CREDENTIAL_ISSUER_URL = "http://localhost:1234";
import { credentialViewerController } from "../../src/credentialViewer/controller";
import { getMockReq, getMockRes } from "@jest-mock/express";
import axios, { AxiosResponse } from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("controller.ts", () => {
  const userinfo = {
    wallet_subject_id:
      "urn:fdc:wallet.account.gov.uk:2024:DtPT8x-dp_73tnlY3KNTiCitziN9GEherD16bqxNt9i",
  };
  const req = getMockReq({
    cookies: {
      app: "some-staging-app",
      id_token: "id_token",
      access_token: "access_token",
    },
    query: {
      offer:
        'https://mobile.dev.account.gov.uk/wallet-test/add?credential_offer={"credentials":["SocialSecurityCredential"],"grants":{"urn:ietf:params:oauth:grant-type:pre-authorized_code":{"pre-authorized_code":"eyJraWQiOiI3OGZhMTMxZDY3N2MxYWMwZjE3MmM1M2I0N2FjMTY5YTk1YWQwZDkyYzM4YmQ3OTRhNzBkYTU5MDMyMDU4Mjc0IiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjgwMDEiLCJjbGllbnRJZCI6IlRFU1RfQ0xJRU5UX0lEIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwIiwiY3JlZGVudGlhbF9pZGVudGlmaWVycyI6WyIzNjg0ZWM2ZC05MmRkLTQyYTgtYmY0Yy1mYTIwMGE4M2I5MmMiXSwiZXhwIjoxNzM2NDQ1MzAxLCJpYXQiOjE3MzY0NDUwMDF9.E0ar-xFbem_Li3gCaqRhu7oFQnQKQevGO5xREVLj3QzKpfteuV4HvPb4z1BxNYDO6ECMyALcI3x9Sl5XUqeE9g"}},"credential_issuer":"http://localhost:8080"}',
    },
    oidc: {
      userinfo: jest.fn().mockImplementation(() => userinfo),
    },
  });
  const { res } = getMockRes();

  it("should render the credential page", async () => {
    const accessToken =
      "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjJjZWQyMmUyLWMxNWItNGUwMi1hYTVmLTdhMTBhMmVhY2NjNyJ9.eyJzdWIiOiJ1cm46ZmRjOndhbGxldC5hY2NvdW50Lmdvdi51azoyMDI0OkR0UFQ4eC1kcF83M3RubFkzS05UaUNpdHppTjlHRWhlckQxNmJxeE50OWkiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDEiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjgwODAiLCJjcmVkZW50aWFsX2lkZW50aWZpZXJzIjpbIjM2ODRlYzZkLTkyZGQtNDJhOC1iZjRjLWZhMjAwYTgzYjkyYyJdLCJjX25vbmNlIjoiMmQ4NzJkYzUtMDdlNi00ZmU4LWI1Y2ItYWQ4OWNiYzY4MzcyIn0.4tIHPhrWzRJhhE8f4OnqRda-y8M10H42r5J5KVPS7iLrFR1amJzCMd3O0KEjVke2ISam9qKe50J9p4qs3O5N-A";
    const mockTokenResponse = {
      data: {
        access_token: accessToken,
      },
    } as AxiosResponse;
    mockedAxios.post.mockResolvedValueOnce(mockTokenResponse);

    const proofJwt =
      "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDprZXk6ekRuYWVXN2FUQ3R6Sll4TWc1dXJlcXV0V1dNTnFvb25jVGZrdFhNYmI1aVg2OEJweCJ9.eyJpc3MiOiJ1cm46ZmRjOmdvdjp1azp3YWxsZXQiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjgwODAiLCJpYXQiOjE3MzY0NDUwMDMzMjYsIm5vbmNlIjoiMmQ4NzJkYzUtMDdlNi00ZmU4LWI1Y2ItYWQ4OWNiYzY4MzcyIn0.D6nzSe_K9oiN3Ux7T2CobYuAiBUruGoXc9tFoSSj0rkwbPWdGCIwQQ-XHqqa803v7hKNOteAnUx6w178SrfDZw";
    const mockProofJwtResponse = {
      data: {
        proofJwt: proofJwt,
      },
    } as AxiosResponse;
    mockedAxios.get.mockResolvedValueOnce(mockProofJwtResponse);

    const credential =
      "eyJraWQiOiI3OGZhMTMxZDY3N2MxYWMwZjE3MmM1M2I0N2FjMTY5YTk1YWQwZDkyYzM4YmQ3OTRhNzBkYTU5MDMyMDU4Mjc0IiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJzdWIiOiJkaWQ6a2V5OnpEbmFlVzdhVEN0ekpZeE1nNXVyZXF1dFdXTU5xb29uY1Rma3RYTWJiNWlYNjhCcHgiLCJuYmYiOjE3MzY0NDUwMDMsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCIsImNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiXSwiZXhwIjoxNzY3OTgxMDAzLCJpYXQiOjE3MzY0NDUwMDMsInZjIjp7InR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJTb2NpYWxTZWN1cml0eUNyZWRlbnRpYWwiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsibmFtZSI6W3sibmFtZVBhcnRzIjpbeyJ2YWx1ZSI6Ik1yIiwidHlwZSI6IlRpdGxlIn0seyJ2YWx1ZSI6IlNhcmFoIiwidHlwZSI6IkdpdmVuTmFtZSJ9LHsidmFsdWUiOiJFbGl6YWJldGgiLCJ0eXBlIjoiR2l2ZW5OYW1lIn0seyJ2YWx1ZSI6IkVkd2FyZHMiLCJ0eXBlIjoiRmFtaWx5TmFtZSJ9XX1dLCJzb2NpYWxTZWN1cml0eVJlY29yZCI6W3sicGVyc29uYWxOdW1iZXIiOiJRUTEyMzQ1NkMifV19fX0.w22z4JkIQ_KdTimjEshPUY75VdPXfCPAHaRTBMEcIP5bVrMvibR5cKM2c3U1GsSGwKvCScVlq12qOIf6x0q5sA";
    const mockCredentialResponse = {
      data: {
        credential: credential,
      },
    } as AxiosResponse;
    mockedAxios.post.mockResolvedValueOnce(mockCredentialResponse);

    await credentialViewerController(req, res);

    expect(res.render).toHaveBeenCalledWith("credential.njk", {
      authenticated: true,
      accessToken: accessToken,
      credential: credential,
      credentialClaims:
        '{"sub":"did:key:zDnaeW7aTCtzJYxMg5urequtWWMNqooncTfktXMbb5iX68Bpx","nbf":1736445003,"iss":"http://localhost:8080","context":["https://www.w3.org/2018/credentials/v1"],"exp":1767981003,"iat":1736445003,"vc":{"type":["VerifiableCredential","SocialSecurityCredential"],"credentialSubject":{"name":[{"nameParts":[{"value":"Mr","type":"Title"},{"value":"Sarah","type":"GivenName"},{"value":"Elizabeth","type":"GivenName"},{"value":"Edwards","type":"FamilyName"}]}],"socialSecurityRecord":[{"personalNumber":"QQ123456C"}]}}}',
      preAuthorizedCode:
        "eyJraWQiOiI3OGZhMTMxZDY3N2MxYWMwZjE3MmM1M2I0N2FjMTY5YTk1YWQwZDkyYzM4YmQ3OTRhNzBkYTU5MDMyMDU4Mjc0IiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjgwMDEiLCJjbGllbnRJZCI6IlRFU1RfQ0xJRU5UX0lEIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwIiwiY3JlZGVudGlhbF9pZGVudGlmaWVycyI6WyIzNjg0ZWM2ZC05MmRkLTQyYTgtYmY0Yy1mYTIwMGE4M2I5MmMiXSwiZXhwIjoxNzM2NDQ1MzAxLCJpYXQiOjE3MzY0NDUwMDF9.E0ar-xFbem_Li3gCaqRhu7oFQnQKQevGO5xREVLj3QzKpfteuV4HvPb4z1BxNYDO6ECMyALcI3x9Sl5XUqeE9g",
      accessTokenClaims:
        '{"sub":"urn:fdc:wallet.account.gov.uk:2024:DtPT8x-dp_73tnlY3KNTiCitziN9GEherD16bqxNt9i","iss":"http://localhost:8001","aud":"http://localhost:8080","credential_identifiers":["3684ec6d-92dd-42a8-bf4c-fa200a83b92c"],"c_nonce":"2d872dc5-07e6-4fe8-b5cb-ad89cbc68372"}',
    });
  });

  it("should render an error page when an error happens", async () => {
    mockedAxios.post.mockRejectedValueOnce("SOME_ERROR");

    await credentialViewerController(req, res);

    expect(res.render).toHaveBeenCalledWith("500.njk");
  });
});
