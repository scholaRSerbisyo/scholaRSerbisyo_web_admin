import "server-only";

import { S3Client, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";
import { env } from "@/env";


const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/`,
    credentials: {
        accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
        secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY
    },
});

export async function uploadFileToBucket(image: string, uuid: string) {
    const Key = uuid;
    const Bucket = env.CLOUDFLARE_BUCKET_NAME;

    const base64Data: Buffer = Buffer.from(
        image.replace(/^data:image\/\w+;base64,/, ""),
        "base64",
    );

    const mimeType = (dataUrl: string) => dataUrl.split(";")[0].split(":")[1];

    let res;

    try {
        const parallelUploads = new Upload({
            client: s3Client,
            params: {
                Bucket,
                Key,
                Body: base64Data,
                ACL: "public-read",
                ContentEncoding: "base64",
                ContentType: mimeType(image),
            },
            queueSize: 4,
            leavePartsOnError: false,
        });

        res = await parallelUploads.done();
    } catch (e) {
        throw e;
    }

    return res;
}

export async function getFileUrl(key: string | undefined) {
    const url = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
            Bucket: env.CLOUDFLARE_BUCKET_NAME,
            Key: key,
        }),
        { expiresIn: 3600 },
    );
    return url;
}

export async function deleteFileUrl(key: string | undefined) {
    const delete_image = new DeleteObjectCommand({
        Bucket: env.CLOUDFLARE_BUCKET_NAME,
        Key: key,
    });
    const response = await s3Client.send(delete_image);
    return response.$metadata.httpStatusCode;
}