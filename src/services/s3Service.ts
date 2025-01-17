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
    ): Promise<string> {
        const uploadParams = {
            Bucket: bucketName,
            Key: imageName,
            Body: imageBuffer,
            ContentType: "png/jpeg",
        };

        try {
            await s3Client.send(new PutObjectCommand(uploadParams));
            const getObjectParams = {
                Bucket: bucketName,
                Key: imageName,
            };

            const signedUrl = await getSignedUrl(
                s3Client,
                new GetObjectCommand(getObjectParams),
                { expiresIn: 3600 }
            );
            return signedUrl;
        } catch (error) {
            logger.error(`Failed to upload image to S3: ${error}`);
            throw error;
        }
    }
}