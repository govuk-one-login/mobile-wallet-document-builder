

process.env.PHOTOS_BUCKET_NAME = "photosBucket";
process.env.ENVIRONMENT = "local";
import { mockClient } from "aws-sdk-client-mock";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  GetObjectCommandOutput,

} from "@aws-sdk/client-s3";
import { uploadPhoto, getPhoto } from "../../src/services/s3Service";
import "aws-sdk-client-mock-jest";

describe("s3Service.ts", () => {
  const bucketName = process.env.PHOTOS_BUCKET_NAME!; //(non-null assertion operator) TO BE REMOVED
  const imageName = "fileName";
  const imageBuffer = Buffer.alloc(10);

  describe("Upload Photo", () => {
    it("should save a photo to the s3 bucket", async () => {
      const s3Mock = mockClient(S3Client);
      s3Mock.on(PutObjectCommand).resolvesOnce({
        $metadata: {
          httpStatusCode: 200,
        },
      });

      await expect(
        uploadPhoto(imageBuffer, imageName, bucketName)
      ).resolves.not.toThrow();
      expect(s3Mock).toHaveReceivedCommandWith(PutObjectCommand, {
        Bucket: bucketName,
        Key: imageName,
        Body: imageBuffer,
      });
    });
    it("should throw an error caught when trying to save a photo to the s3 bucket", async () => {
      const s3Mock = mockClient(S3Client);
      s3Mock.on(PutObjectCommand).rejectsOnce("SOME_S3_ERROR");

      await expect(
        uploadPhoto(imageBuffer, imageName, bucketName)
      ).rejects.toThrow("SOME_S3_ERROR");
      expect(s3Mock).toHaveReceivedCommandWith(PutObjectCommand, {
        Bucket: bucketName,
        Key: imageName,
        Body: imageBuffer,
      });
    });
  });
  describe("Get Photo", () => {
    const mockS3Response = (content: string) => {
      return {
        transformToString: async () => content,
      };
    };

    it("should get a photo from the s3 bucket", async () => {
      const s3Mock = mockClient(S3Client);
      s3Mock
        .on(GetObjectCommand)
        .resolvesOnce({
          Body: mockS3Response("base64image"),
        } as GetObjectCommandOutput);

      const response = await getPhoto(imageName, bucketName);
      expect(response).toEqual("base64image");
    });

    it("it should return undefined if the S3 response Body is undefined", async () => {
      const s3Mock = mockClient(S3Client);
      s3Mock
        .on(GetObjectCommand)
        .resolvesOnce({ Body: undefined } as GetObjectCommandOutput);

      const response = await getPhoto(imageName, bucketName);
      expect(response).toEqual(undefined);
    });

    it("it should throw the error thrown by the S3 client", async () => {
      const s3Mock = mockClient(S3Client);
      s3Mock.on(GetObjectCommand).rejectsOnce("Error getting image");

      await expect(getPhoto(imageName, bucketName)).rejects.toThrow(
        "Error getting image"
      );
      expect(s3Mock).toHaveReceivedCommandWith(GetObjectCommand, {
        Bucket: bucketName,
        Key: imageName,
      });
    });
  });
});
