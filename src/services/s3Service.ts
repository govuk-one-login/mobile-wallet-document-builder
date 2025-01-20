import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Config } from "../config/aws";
import { logger } from "../middleware/logger";

const s3Client = new S3Client(getS3Config());

export class S3Service {
  async uploadImage(
    imageBuffer: Buffer,
    imageName: string,
    bucketName: string
  ): Promise<void> {
    const uploadParams = {
      Bucket: bucketName,
      Key: imageName,
      Body: imageBuffer,
      ContentType: "png/jpeg",
    };

    try {
      await s3Client.send(new PutObjectCommand(uploadParams));
    } catch (error) {
      logger.error(`Failed to upload image to S3: ${error}`);
      throw error;
    }
  }

  async getImage(
    imageName: string,
    bucketName: string
  ): Promise<string | undefined> {
    const getObjectParams = {
      Bucket: bucketName,
      Key: imageName,
    };

    try {
      const response = await s3Client.send(
        new GetObjectCommand(getObjectParams)
      );
      if (response.Body === undefined) {
        logger.info(`Object with key ${imageName} not found`);
        return undefined;
      }
      return await response.Body.transformToString();
    } catch (error) {
      logger.error(`Failed to get image from S3: ${error}`);
      throw error;
    }
  }
}
