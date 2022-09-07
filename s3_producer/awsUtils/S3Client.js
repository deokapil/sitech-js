const AWS = require("aws-sdk");
const logger = require("../logger");

class S3Client {
  constructor() {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    this.client = new AWS.S3();
  }

  async getBucketList(bucket) {
    // Call S3 to list the buckets
    try {
      const bucketList = await this.client
        .listObjects({ Bucket: bucket })
        .promise();
      return bucketList;
    } catch (err) {
      logger.error(
        `Failed to fetch Bucket List from bucket ${bucket} : ${err}`
      );
      throw err;
    }
  }
  async getObect(bucket, objId) {
    // Call S3 to list the buckets
    try {
      const bucketList = await this.client
        .getObject({ Bucket: bucket })
        .promise();
      return bucketList;
    } catch (err) {
      logger.error(
        `Failed to fetch Bucket List from bucket ${bucket} : ${err}`
      );
      throw err;
    }
  }
}
module.exports = S3Client;
