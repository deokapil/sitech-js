const logger = require("logger");
require("dotenv").config();
const crypto = require("crypto");
const SFTPUtils = require("./sFTPUtils");
const { s3Utils } = require("awsutils");
const fetch = require("node-fetch");

async function postJson(js, url) {
  const log = {
    from: "producer",
    time: Date.now(),
    ...{ js },
  };
  try {
    const response = await fetch(url, {
      method: "post",
      body: JSON.stringify(log),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    console.log(data);
  } catch (err) {
    logger.info(`${log.cronId}: Failed to connect to ${url}: ${err}`);
  }
}

function logToServer(js) {
  return postJson(js, `${process.env.API_GATEWAY_URL}/trans-logs`);
}

function consume(js) {
  return postJson(js, `${process.env.CONSUMER_URL}/consume`);
}

const configParamsS3 = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};
const configSFTP = {
  host: process.env.SFTP_HOST,
  port: process.env.SFTP_PORT,
  username: process.env.SFTP_USER,
  password: process.env.SFTP_PASS,
};

async function main() {
  // get s3 cleient

  const cronId = crypto.randomUUID();
  logger.info(`${cronId}: Producer start polling for transactions`);

  await logToServer({
    cronId,
    text: "Producer start polling for transactions",
  });

  const s3 = new s3Utils(configParamsS3);
  const sftpClient = new SFTPUtils(configSFTP);
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
        `uploads/${uploadedkey}`,
        fileStream
      );

      await consume({ cronId, uploaded });

      logger.info(
        `Deleting object from producer Bucket ${process.env.AWS_SAMPLE_BUCKET}`
      );

      await sftpClient.deleteFile(
        `${process.env.SFTP_UPLOAD_DIR}/${fileList[i].name}`
      );
      await logToServer({
        cronId,
        text: `Producer processed file ${fileList[i].name}`,
      });
    }
  } catch (error) {
    logger.error(`${cronId}- ${error}`);
  } finally {
    await sftpClient.close();
  }
}

main();
