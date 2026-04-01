import * as photoUtils from "../../src/utils/photoUtils";
import * as s3Service from "../../src/services/s3Service";
import * as config from "../../src/config/appConfig";
import { handlePhoto } from "../../src/services/photoHandler";

jest.mock("../../src/config/appConfig");
jest.mock("../../src/services/s3Service");
jest.mock("../../src/utils/photoUtils");

describe("photoHandler", () => {
  const mockBuffer = Buffer.from("taste-image");
  const mockMime = "image/jpeg";
  const selectedPhoto = "test.jpg";

  beforeEach(() => {
    jest.clearAllMocks();

    (photoUtils.getPhoto as jest.Mock).mockReturnValue({
      photoBuffer: mockBuffer,
      mimeType: mockMime,
    });

    (s3Service.uploadPhoto as jest.Mock).mockResolvedValue(undefined);

    (config.getPhotosBucketName as jest.Mock).mockReturnValue("test-bucket");
  });

  it("should upload photo and return s3Uri", async () => {
    const result = await handlePhoto(selectedPhoto);

    expect(result).toMatch(/^s3:\/\/test-bucket\/.+$/);

    expect(photoUtils.getPhoto).toHaveBeenCalledWith(selectedPhoto);

    expect(s3Service.uploadPhoto).toHaveBeenCalledWith(
      mockBuffer,
      expect.any(String),
      "test-bucket",
      mockMime,
    );
  });

  it("should throw an error if getPhoto fails", async () => {
    (photoUtils.getPhoto as jest.Mock).mockImplementation(() => {
      throw new Error("File not found");
    });

    await expect(handlePhoto(selectedPhoto)).rejects.toThrow("File not found");
  });

  it("should throw an error if uploadPhoto fails", async () => {
    (s3Service.uploadPhoto as jest.Mock).mockRejectedValue(
      new Error("Upload failed"),
    );

    await expect(handlePhoto(selectedPhoto)).rejects.toThrow("Upload failed");
  });
});
