import axios, { AxiosResponse } from "axios";
import { revokeCredentials } from "../../../src/revoke/services/revokeService";
import { getCriEndpoint } from "../../../src/config/appConfig";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("../../../src/config/appConfig");
const mockedGetCriEndpoint = getCriEndpoint as jest.MockedFunction<
  typeof getCriEndpoint
>;

export const CRI_URL = "https://test-cri.example.com";
export const DRIVING_LICENCE_NUMBER = "EDWAR210513SE5RO";

describe("revokeService.ts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetCriEndpoint.mockReturnValue(CRI_URL);
  });

  it("should send POST request to the CRI to revoke credentials", async () => {
    const mockCriResponse = {
      status: 202,
    } as AxiosResponse;
    mockedAxios.post.mockResolvedValue(mockCriResponse);

    await revokeCredentials(DRIVING_LICENCE_NUMBER);

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

    const response = await revokeCredentials(DRIVING_LICENCE_NUMBER);

    expect(response).toEqual({
      message: "Credential(s) successfully revoked",
      messageType: "success",
    });
  });

  it("should return error message when CRI returns 404", async () => {
    const mockCriResponse = {
      status: 404,
    } as AxiosResponse;
    mockedAxios.post.mockResolvedValue(mockCriResponse);

    const response = await revokeCredentials(DRIVING_LICENCE_NUMBER);

    expect(response).toEqual({
      message: "No credential found for this driving licence number",
      messageType: "error",
    });
  });

  it("should return error message for other status codes such as 500", async () => {
    const mockCriResponse = {
      status: 500,
    } as AxiosResponse;
    mockedAxios.post.mockResolvedValue(mockCriResponse);

    const response = await revokeCredentials(DRIVING_LICENCE_NUMBER);

    expect(response).toEqual({
      message:
        "An error happened and the credential(s) may not have been revoked",
      messageType: "error",
    });
  });

  it("should propagate error thrown by axios", async () => {
    mockedAxios.post.mockRejectedValue(new Error("Network error"));

    await expect(revokeCredentials(DRIVING_LICENCE_NUMBER)).rejects.toThrow(
      "Network error",
    );
  });
});
