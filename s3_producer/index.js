const logger = require("logger");
const { s3Utils } = require("awsutils");
require("dotenv").config();
const crypto = require("crypto");

async function main() {
  // get s3 cleient

  const cronId = crypto.randomUUID();
  logger.info(`${cronId}: Producer start polling for transactions`);

  const s3 = new s3Utils();
  const bucketList = await s3.getBucketList(process.env.AWS_SAMPLE_BUCKET);

  logger.info(`${cronId} ${bucketList ? bucketList.length : 0}: files found`);

  try {
    for (let i = 0; i < bucketList?.length; i++) {
      logger.info(`Fetching file with key ${bucketList[i].Key}`);

      const obj = await s3.getObect(
        process.env.AWS_SAMPLE_BUCKET,
        bucketList[i].Key
      );

      const uploadedkey = `${cronId}-${bucketList[i].Key}`;
      logger.info(
        `Uploading to consumer Bucket ${process.env.AWS_BUCKET_NAME}`
      );
      const uploadedObj = await s3.sendToS3(
        process.env.AWS_BUCKET_NAME,
        uploadedkey,
        obj
      );
      logger.info(
        `Deleting object from producer Bucket ${process.env.AWS_SAMPLE_BUCKET}`
      );
      if (uploadedObj.$metadata.httpStatusCode == 200) {
        deleteObj = await s3.deleteS3Obj(
          process.env.AWS_SAMPLE_BUCKET,
          bucketList[i].Key
        );
      }
    }
  } catch (error) {
    logger.error(`${cronId}- ${error}`);
  }
}

main();
