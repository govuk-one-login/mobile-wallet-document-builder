import { getPhoto } from "../services/s3Service";
import { logger } from "../middleware/logger";

export async function handlePhoto(
  data: { photo: string },
  itemId: string,
): Promise<{ photo: string } | null> {
  const s3Uri = data.photo;

  const { bucketName, fileName } = getBucketAndFileName(s3Uri);

  const photo = await getPhoto(fileName, bucketName);

  if (!photo) {
    logger.error(`Photo for document with ID ${itemId} not found`);
    return null;
  }

  return {
    ...data,
    photo,
  };
}

function getBucketAndFileName(s3Uri: string): {
  bucketName: string;
  fileName: string;
} {
  const s3UriParts = s3Uri.split("/");
  const bucketName = s3UriParts[2];
  const fileName = s3UriParts[3];
  return { bucketName, fileName };
}
