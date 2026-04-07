import * as s3Service from "../../src/services/s3Service";
import { handlePhoto } from "../../src/services/photoHandler";

jest.mock("../../src/config/appConfig");
jest.mock("../../src/services/s3Service");
jest.mock("../../src/utils/photoUtils");

describe("photoHandler", () => {
  it("should return data with photo when getPhoto is successful", async () => {
    const data = { photo: "s3://test-bucket/test-file" };

    (s3Service.getPhoto as jest.Mock).mockResolvedValue("photo");

    const result = await handlePhoto(data, "123");

    expect(result).toEqual({
      ...data,
      photo: "photo",
    });

    expect(s3Service.getPhoto).toHaveBeenCalledWith("test-file", "test-bucket");
  });

  it("should return null when getPhoto returns undefined", async () => {
    const data = { photo: "s3://test-bucket/test-file" };

    (s3Service.getPhoto as jest.Mock).mockResolvedValue(undefined);

    const result = await handlePhoto(data, "123");

    expect(result).toBeNull();
  });
});
