const logger = require("logger");
require("dotenv").config();
const crypto = require("crypto");
const SFTPUtils = require("./sFTPUtils");
const { s3Utils } = require("awsutils");

async function main() {
  // get s3 cleient
  const config = {
    host: process.env.SFTP_HOST,
    port: process.env.SFTP_PORT,
    username: process.env.SFTP_USER,
    password: process.env.SFTP_PASS,
  };

  const cronId = crypto.randomUUID();
  logger.info(`${cronId}: Producer start polling for transactions`);

  const s3 = new s3Utils();
  const sftpClient = new SFTPUtils(config);
  await sftpClient.connect();

  const fileList = await sftpClient.getDirList(process.env.SFTP_UPLOAD_DIR);

  logger.info(`${cronId} ${fileList ? fileList.length : 0}: files found`);

  try {
    for (let i = 0; i < fileList?.length; i++) {
      logger.info(`Fetching file with key ${fileList[i].name}`);

      const uploadedkey = `${cronId}-${fileList[i].name}`;
      // create buket key
      logger.info(
        `Uploading to consumer Bucket ${process.env.AWS_BUCKET_NAME}`
      );

      const fileStream = sftpClient.getReadStream(
        `${process.env.SFTP_UPLOAD_DIR}/${fileList[i].name}`
      );
      const uploaded = await s3.uploadObectStream(
        process.env.AWS_BUCKET_NAME,
        uploadedkey,
        fileStream
      );

      logger.info(
        `Deleting object from producer Bucket ${process.env.AWS_SAMPLE_BUCKET}`
      );
      // if (uploadedObj.$metadata.httpStatusCode == 200) {
      //   deleteObj = await s3.deleteS3Obj(
      //     process.env.AWS_SAMPLE_BUCKET,
      //     bucketList[i].Key
      //   );
      // }
    }
  } catch (error) {
    logger.error(`${cronId}- ${error}`);
  } finally {
    await sftpClient.close();
  }
}

main();
