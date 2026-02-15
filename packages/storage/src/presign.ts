import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl as getS3SignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client } from "./client";

export const getSignedUploadUrl = async (
	path: string,
	options: { bucket: string },
): Promise<string> => {
	const client = getS3Client();
	try {
		return await getS3SignedUrl(
			client,
			new PutObjectCommand({
				Bucket: options.bucket,
				Key: path,
				ContentType: "image/jpeg",
			}),
			{
				expiresIn: 60,
			},
		);
	} catch (e) {
		console.error(e);
		throw new Error("Could not get signed upload url");
	}
};

export const getSignedUrl = async (
	path: string,
	options: { bucket: string; expiresIn?: number },
): Promise<string> => {
	const client = getS3Client();
	try {
		return getS3SignedUrl(
			client,
			new GetObjectCommand({ Bucket: options.bucket, Key: path }),
			{ expiresIn: options.expiresIn },
		);
	} catch (e) {
		console.error(e);
		throw new Error("Could not get signed url");
	}
};

export const deleteFile = async (
	path: string,
	options: { bucket: string },
): Promise<void> => {
	const client = getS3Client();
	try {
		await client.send(
			new DeleteObjectCommand({
				Bucket: options.bucket,
				Key: path,
			}),
		);
	} catch (e: any) {
		// If the file doesn't exist, consider it a successful deletion
		if (e.name === "NoSuchKey" || e.Code === "NoSuchKey") {
			console.info(
				`File ${path} does not exist, treating as successful deletion`,
			);
			return;
		}
		console.error(e);
		throw new Error("Could not delete file");
	}
};
