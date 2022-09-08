const {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const logger = require("../logger");

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
  async getObect(bucket, objId) {
    const objParams = { Bucket: bucket, Key: objId };
    try {
      const data = await this.client.send(new GetObjectCommand(objParams));
    } catch (err) {
      logger.error(
        `Failed to fetch Bucket List from bucket ${bucket} : ${err}`
      );
      throw err;
    }
  }
}
module.exports = S3Utils;
