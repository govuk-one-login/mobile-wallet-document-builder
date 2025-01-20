import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getS3Config } from "../config/aws";
import { logger } from "../middleware/logger";

const s3Client = new S3Client(getS3Config());

export async function uploadPhoto(
  imageBuffer: Buffer,
  imageName: string,
  bucketName: string
): Promise<void> {
  const uploadParams = {
    Bucket: bucketName,
    Key: imageName,
    Body: imageBuffer,
  };

  try {
    await s3Client.send(new PutObjectCommand(uploadParams));
  } catch (error) {
    logger.error(`Failed to upload image to S3: ${error}`);
    throw error;
  }
}

export async function getPhoto(
  imageName: string,
  bucketName: string
): Promise<string | undefined> {
  const getObjectParams = {
    Bucket: bucketName,
    Key: imageName,
  };

  try {
    const response = await s3Client.send(new GetObjectCommand(getObjectParams));
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
