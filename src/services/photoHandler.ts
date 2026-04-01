import { getPhoto } from "../utils/photoUtils";
import { uploadPhoto } from "./s3Service";
import { getPhotosBucketName } from "../config/appConfig";
import { randomUUID } from "node:crypto";

export async function handlePhoto(selectedPhoto: string): Promise<string> {
  const { photoBuffer, mimeType } = getPhoto(selectedPhoto);

  const bucketName = getPhotosBucketName();
  const itemId = randomUUID();
  const s3Uri = `s3://${bucketName}/${itemId}`;

  await uploadPhoto(photoBuffer, itemId, bucketName, mimeType);

  return s3Uri;
}
