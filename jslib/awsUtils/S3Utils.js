const {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const logger = require("../logger");
const { PassThrough, pipeline } = require("node:stream");

class S3Utils {
  constructor() {
    const configParams = {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    };

    this.client = new S3Client({ credentials: configParams });
  }

  async getBucketList(bucket) {
    const bucketParams = { Bucket: bucket };
    try {
      const data = await this.client.send(
        new ListObjectsV2Command(bucketParams)
      );
      // process data.
      return data.Contents;
    } catch (error) {
      logger.error(
        `Failed to fetch Bucket List from bucket ${bucket} : ${error}`
      );
      throw error;
    }
  }
  async getObectStream(bucket, objId) {
    const objParams = { Bucket: bucket, Key: objId };
    try {
      const data = await this.client.send(new GetObjectCommand(objParams));
      return data;
    } catch (err) {
      logger.error(
        `Failed to fetch Bucket List from bucket ${bucket} : ${err}`
      );
      throw err;
    }
  }
  async uploadObectStream(bucket, objId, stream) {
    const passThrough = new PassThrough();
    pipeline(stream, passThrough, () => {});

    try {
      var bucketParams = { Bucket: bucket, Key: objId, Body: passThrough };
      const parallelUploads3 = new Upload({
        client: this.client,
        queueSize: 1, // optional concurrency configuration
        leavePartsOnError: false, // optional manually handle dropped parts
        params: bucketParams,
      });
      const data = await parallelUploads3.done();
      console.log(data);
      return data;
    } catch (err) {
      logger.error(`Failed to upload to ${bucket} : ${err}`);
      throw err;
    }
  }
  async getObect(bucket, objId) {
    const objParams = { Bucket: bucket, Key: objId };
    try {
      const streamToString = (stream) =>
        new Promise((resolve, reject) => {
          const chunks = [];
          stream.on("data", (chunk) => chunks.push(chunk));
          stream.on("error", reject);
          stream.on("end", () =>
            resolve(Buffer.concat(chunks).toString("utf8"))
          );
        });

      const data = await this.client.send(new GetObjectCommand(objParams));
      const bodyContents = await streamToString(data.Body);
      return bodyContents;
    } catch (err) {
      logger.error(
        `Failed to fetch Bucket List from bucket ${bucket} : ${err}`
      );
      throw err;
    }
  }

  async sendToS3(Bucket, Key, Body) {
    const bucketParams = {
      Bucket,
      Key,
      Body,
    };
    try {
      const data = await this.client.send(new PutObjectCommand(bucketParams));
      logger.info("Successfully uploaded object: " + Bucket + "/" + Key);
      return data;
    } catch (err) {
      logger.error(`Failed to upload to bucket ${Bucket} : ${err}`);
      throw err;
    }
  }

  async deleteS3Obj(Bucket, Key) {
    const bucketParams = {
      Bucket,
      Key,
    };
    try {
      const data = await this.client.send(
        new DeleteObjectCommand(bucketParams)
      );
      logger.info(`Success. Object with key ${Key} deleted.`);
      return data;
    } catch (err) {
      logger.error("Error", err);
    }
  }
}
module.exports = S3Utils;
