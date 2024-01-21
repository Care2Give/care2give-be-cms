import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import * as Constants from "../constants";
import { randomUUID } from "crypto";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

class S3 {
  client: S3Client;
  bucketName: string;
  bucketRegion: string;

  constructor(
    bucketName: string,
    accessKeyId: string,
    secretAccessKey: string,
    region: string
  ) {
    this.client = new S3Client({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      region,
    });
    this.bucketName = bucketName;
    this.bucketRegion = region;
  }

  /**
   * Helper function to upload a single file in Multer (middleware) in-memory storage to S3
   * @param file
   * @returns s3 object key
   */
  async sendToS3(file: Express.Multer.File) {
    const { buffer, mimetype } = file;
    const key = randomUUID(); // images will be overriden if file name is same
    console.log(
      `Sending to S3 bucket [${this.bucketName}]: path [${key}] with contentType [${mimetype}]`
    );
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    });
    await s3.client.send(command);
    console.log(
      `Successfully sent to S3 bucket [${this.bucketName}]: path [${key}]`
    );
    return key;
  }

  /**
   * Generates pre-signed url for s3 object key that expires in 1 hour
   * @param key s3 object key
   * @returns presigned url for s3 object
   */
  async getSignedUrlFromS3(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    const url = await getSignedUrl(s3.client, command, {
      expiresIn: Constants.ONE_HOUR_IN_SECONDS,
    });
    console.log(
      `Successfully generated pre-signed url from S3 bucket [${this.bucketName}] for object key [${key}]`
    );
    return url;
  }

  /**
   * Checks if a given key exists in the s3 bucket, throws an error if does not exist
   * @param key s3 object key
   */
  async checkValidKey(key: string) {
    const command = new HeadObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    await s3.client.send(command);
  }
}

const s3 = new S3(
  Constants.BUCKET_NAME,
  Constants.ACCESS_KEY,
  Constants.SECRET_ACCESS_KEY,
  Constants.BUCKET_REGION
);
export default s3;
