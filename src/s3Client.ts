import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as Constants from "./constants";
import { randomUUID } from "crypto";

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
   * Function to upload many files in the Multer (middleware) in-memory storage to S3.
   * @param files
   * @returns Promise of url in order of upload
   */
  async sendManyToS3(files: Express.Multer.File[]): Promise<string[]> {
    return await Promise.all(
      Array.from({ length: files.length }).map(async (_, i) => {
        const { buffer, mimetype } = files[i];
        const path = randomUUID();
        const url = this._constructImageUrl(path);
        await this.sendToS3(path, buffer, mimetype);
        return url;
      })
    );
  }

  /**
   * Helper function to upload a single file in Multer (middleware) in-memory storage to S3
   * NOTE: images will be overwritten if filePath is same
   * @param filePath
   * @param fileBuffer
   * @param contentType
   */
  async sendToS3(filePath: string, fileBuffer: Buffer, contentType: string) {
    console.log(
      `Sending to S3 bucket [${this.bucketName}]: [${filePath}] with contentType [${contentType}]`
    );
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: filePath,
      Body: fileBuffer,
      ContentType: contentType,
    });
    await s3.client.send(command);
    console.log(
      `Successfully sent to S3 bucket [${this.bucketName}]: ${filePath}`
    );
  }

  /**
   * Returns S3 Object URL based on given path
   * @param path S3 Object Key
   * @returns S3 Object URL
   */
  _constructImageUrl(path: string) {
    const domain = [
      s3.bucketName,
      "s3",
      s3.bucketRegion,
      "amazonaws",
      "com",
    ].join(".");
    return [domain, path].join("/");
  }
}

const s3 = new S3(
  Constants.BUCKET_NAME,
  Constants.ACCESS_KEY,
  Constants.SECRET_ACCESS_KEY,
  Constants.BUCKET_REGION
);
export default s3;
