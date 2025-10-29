import axios, { AxiosResponse } from "axios";
import { revokeCredentials } from "../../../src/revoke/services/revokeService";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const CRI_URL = "https://test-cri.example.com";
const DOCUMENT_ID = "ABC123DEF567";

describe("revokeService.ts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send POST request to the CRI to revoke credentials", async () => {
    const expectedRevokeUrl =
      "https://test-cri.example.com/revoke/ABC123DEF567";
    const mockCriResponse = {
      status: 202,
    } as AxiosResponse;
    mockedAxios.post.mockResolvedValue(mockCriResponse);

    await revokeCredentials(CRI_URL, DOCUMENT_ID);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expectedRevokeUrl,
      null,
      expect.objectContaining({
        validateStatus: expect.any(Function),
      }),
    );
  });

  it("should return a success message when the CRI returns 202", async () => {
    const mockCriResponse = {
      status: 202,
    } as AxiosResponse;
    mockedAxios.post.mockResolvedValue(mockCriResponse);

    const response = await revokeCredentials(CRI_URL, DOCUMENT_ID);

    expect(response).toEqual({
      message: "Credential(s) successfully revoked",
      messageType: "success",
    });
  });

  it("should return info message when CRI returns 404", async () => {
    const mockCriResponse = {
      status: 404,
    } as AxiosResponse;
    mockedAxios.post.mockResolvedValue(mockCriResponse);

    const response = await revokeCredentials(CRI_URL, DOCUMENT_ID);

    expect(response).toEqual({
      message: "No credential found for this document identifier",
      messageType: "info",
    });
  });

  it("should return error message for other status codes such as 500", async () => {
    const mockCriResponse = {
      status: 500,
    } as AxiosResponse;
    mockedAxios.post.mockResolvedValue(mockCriResponse);

    const response = await revokeCredentials(CRI_URL, DOCUMENT_ID);

    expect(response).toEqual({
      message:
        "Something went wrong and the credential(s) may not have been revoked",
      messageType: "error",
    });
  });

  it("should propagate error thrown by axios", async () => {
    mockedAxios.post.mockRejectedValue(new Error("Network error"));

    await expect(revokeCredentials(CRI_URL, DOCUMENT_ID)).rejects.toThrow(
      "Network error",
    );
  });
});
