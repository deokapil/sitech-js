const logger = require("./logger");
const awsUtils = require("./awsUtils");
require("dotenv").config();

async function main() {
  // get s3 cleient
  const s3 = new awsUtils.s3Utils();
  const bucketList = await s3.getBucketList(process.env.AWS_SAMPLE_BUCKET);
  for (let i = 0; i < bucketList.length; i++) {
    console.log(bucketList[i].Key);
  }
  // console.log(bucket);
  // get List of bucket from s3
  // for each object in list
  // put object in another bucket
}

main();
