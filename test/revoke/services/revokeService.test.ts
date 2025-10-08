import axios, { AxiosResponse } from "axios";
import { revokeCredentials } from "../../../src/revoke/services/revokeService";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const CRI_URL = "https://test-cri.example.com";
const DRIVING_LICENCE_NUMBER = "EDWAR210513SE5RO";

describe("revokeService.ts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send POST request to the CRI to revoke credentials", async () => {
    const mockCriResponse = {
      status: 202,
    } as AxiosResponse;
    mockedAxios.post.mockResolvedValue(mockCriResponse);

    await revokeCredentials(CRI_URL, DRIVING_LICENCE_NUMBER);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${CRI_URL}/revoke`,
      { drivingLicenceNumber: DRIVING_LICENCE_NUMBER },
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

    const response = await revokeCredentials(CRI_URL, DRIVING_LICENCE_NUMBER);

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

    const response = await revokeCredentials(CRI_URL, DRIVING_LICENCE_NUMBER);

    expect(response).toEqual({
      message: "No credential found for this driving licence number",
      messageType: "info",
    });
  });

  it("should return error message for other status codes such as 500", async () => {
    const mockCriResponse = {
      status: 500,
    } as AxiosResponse;
    mockedAxios.post.mockResolvedValue(mockCriResponse);

    const response = await revokeCredentials(CRI_URL, DRIVING_LICENCE_NUMBER);

    expect(response).toEqual({
      message:
        "Something went wrong and the credential(s) may not have been revoked",
      messageType: "error",
    });
  });

  it("should propagate error thrown by axios", async () => {
    mockedAxios.post.mockRejectedValue(new Error("Network error"));

    await expect(
      revokeCredentials(CRI_URL, DRIVING_LICENCE_NUMBER),
    ).rejects.toThrow("Network error");
  });
});
