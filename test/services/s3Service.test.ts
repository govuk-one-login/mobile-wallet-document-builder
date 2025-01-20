
process.env.PHOTOS_BUCKET_NAME = "photosBucket";
process.env.ENVIRONMENT = "local";
import { mockClient } from "aws-sdk-client-mock";
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
} from "@aws-sdk/client-s3";
import { uploadPhoto, getPhoto } from "../../src/services/s3Service";
import "aws-sdk-client-mock-jest";

describe("s3Service.ts", () => {
    const uploadParams = {
        Bucket: process.env.PHOTOS_BUCKET_NAME,
        Key: 'fileName',
        Body: Buffer.alloc(10)
    }
    it("should save a photo to the s3 bucket", async () => {

        const s3Mock = mockClient(S3Client);
        s3Mock.on(PutObjectCommand).resolvesOnce({
            $metadata: {
                httpStatusCode: 200,
            },
        });

    })
})