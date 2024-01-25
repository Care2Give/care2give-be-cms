import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as Constants from "../constants";
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
   * Helper function to upload a single file in Multer (middleware) in-memory storage to S3
   * @param file
   * @returns s3 object url
   */
  async sendToS3(file: Express.Multer.File) {
    const { buffer, mimetype } = file;
    const path = randomUUID(); // images will be overriden if file name is same
    const url = this._constructImageUrl(path);
    console.log(
      `[LOG] Sending to S3 bucket [${this.bucketName}]: path [${path}] with contentType [${mimetype}]`
    );
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: path,
      Body: buffer,
      ContentType: mimetype,
      ACL: "public-read",
    });
    await s3.client.send(command);
    console.log(
      `[LOG] Successfully sent to S3 bucket [${this.bucketName}]: path [${path}]`
    );
    return url;
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
    return "https://" + [domain, path].join("/");
  }
}

const s3 = new S3(
  Constants.BUCKET_NAME,
  Constants.ACCESS_KEY,
  Constants.SECRET_ACCESS_KEY,
  Constants.BUCKET_REGION
);
export default s3;
