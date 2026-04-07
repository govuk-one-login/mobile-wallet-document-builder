import * as s3Service from "../../src/services/s3Service";
import { handlePhoto } from "../../src/services/photoHandler";

jest.mock("../../src/config/appConfig");
jest.mock("../../src/services/s3Service");

describe("photoHandler", () => {
  it("should return base64 photo string when getPhoto is successful", async () => {
    (s3Service.getPhoto as jest.Mock).mockResolvedValue("base64Photo");

    const result = await handlePhoto("s3://test-bucket/test-file", "123");

    expect(s3Service.getPhoto).toHaveBeenCalledWith("test-file", "test-bucket");
    expect(result).toBe("base64Photo");
  });

  it("should return null when getPhoto returns undefined", async () => {
    (s3Service.getPhoto as jest.Mock).mockResolvedValue(undefined);

    const result = await handlePhoto("s3://test-bucket/test-file", "123");

    expect(result).toBeNull();
  });
});
