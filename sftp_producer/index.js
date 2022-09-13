const logger = require("logger");
const { s3Utils } = require("awsutils");
require("dotenv").config();
const crypto = require("crypto");

let Client = require("ssh2-sftp-client");
const { exit } = require("process");

const getDirList = async (dir) => {
  let sftp = new Client();
  await sftp.connect({
    host: process.env.SFTP_HOST,
    port: process.env.SFTP_PORT,
    username: process.env.SFTP_USER,
    password: process.env.SFTP_PASS,
  });

  const list = await sftp.list(dir);

  await sftp.end();
  return list;
};

const pipeObect = async (remotePath) => {
  try {
    let sftp = new Client();
    await sftp.connect({
      host: process.env.SFTP_HOST,
      port: process.env.SFTP_PORT,
      username: process.env.SFTP_USER,
      password: process.env.SFTP_PASS,
    });
    return sftp.createReadStream(remotePath);
  } catch (err) {
    logger.error(`Failed to pipe file to bucket ${remotePath} : ${err}`);
    throw err;
  }
};

async function main() {
  // get s3 cleient

  const cronId = crypto.randomUUID();
  logger.info(`${cronId}: Producer start polling for transactions`);

  const s3 = new s3Utils();

  // get files list from sftp server

  // const bucketList = [];
  const bucketList = await getDirList(process.env.SFTP_UPLOAD_DIR);
  console.log(bucketList);

  logger.info(`${cronId} ${bucketList ? bucketList.length : 0}: files found`);

  try {
    for (let i = 0; i < bucketList?.length; i++) {
      logger.info(`Fetching file with key ${bucketList[i].name}`);

      const uploadedkey = `${cronId}-${bucketList[i].name}`;
      // create buket key
      logger.info(
        `Uploading to consumer Bucket ${process.env.AWS_BUCKET_NAME}`
      );

      const fileStream = await pipeObect(
        `${process.env.SFTP_UPLOAD_DIR}/${bucketList[i].name}`
      );
      const uploaded = await s3.uploadObectStream(
        process.env.AWS_BUCKET_NAME,
        uploadedkey,
        fileStream
      );
      // const uploadedObj = await s3.sendToS3(
      //   process.env.AWS_BUCKET_NAME,
      //   uploadedkey,
      //   obj
      // );

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
    exit(1);
  }
}

main();
