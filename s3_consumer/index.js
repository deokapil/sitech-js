const logger = require("logger");
const { s3Utils } = require("awsutils");
require("dotenv").config();
const fastify = require("fastify")({ logger: true });
const { X12parser } = require("x12-parser");
const { DateTime } = require("luxon");

const fetch = require("node-fetch");

const configParamsS3 = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};

async function postJson(js, url) {
  try {
    const response = await fetch(url, {
      method: "post",
      body: JSON.stringify(js),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    console.log(data);
  } catch (err) {
    logger.info(`${log.cronId}: Failed to connect to ${url}: ${err}`);
  }
}

const s3 = new s3Utils(configParamsS3);

// Declare a route
fastify.get("/", async (request, reply) => {
  // console.log();
  return { hello: "ok" };
});

fastify.post("/consume", async (request, reply) => {
  const key = request.body.js.uploaded.Key;
  const stream = await s3.getObectStream(process.env.AWS_BUCKET_NAME, key);
  const someValue = await check(stream.Body);
  const processedKey = `processed/${key.split("/").at(-1)}`;

  console.log(someValue);
  const upload = await s3.sendToS3(
    process.env.AWS_BUCKET_NAME,
    processedKey,
    JSON.stringify(someValue)
  );
  const infGateway = await postJson(
    {
      from: "consumer",
      key: processedKey,
      tranSet: 830,
      direction: "inbound",
      tradingPartner: "ABCD Systems",
      recTime: DateTime.now().valueOf(),
      status: "success",
    },
    `${process.env.API_GATEWAY_URL}/trans-logs`
  );
  console.log(upload);
  return { hello: "world" };
});

async function main() {
  try {
    await fastify.listen({ port: 3500 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

async function check(ediFile) {
  const myParser = new X12parser();
  myParser.on("error", (err) => {
    console.error(err);
  });

  const segments = [];

  return new Promise((resolve, reject) => {
    ediFile
      .pipe(myParser)
      .on("data", (data) => {
        segments.push(data);
      })
      .on("end", () => {
        resolve(segments);
      });
  });
}
main();
