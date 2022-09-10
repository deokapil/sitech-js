const logger = require("logger");
const { s3Utils } = require("awsutils");
require("dotenv").config();

const fastify = require("fastify")({ logger: true });

const { X12parser } = require("x12-parser");
const { createReadStream } = require("fs");

// Declare a route
fastify.get("/", async (request, reply) => {
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

async function check() {
  const myParser = new X12parser();
  myParser.on("error", (err) => {
    console.error(err);
  });
  const ediFile = createReadStream(
    "/home/baba/edi-io/S4_Hana_EDI_830_Ford_SCD_IN_X12_INPUT.txt"
  );
  ediFile.on("error", (err) => {
    console.error(err);
  });

  // Handle events from the parser
  ediFile.pipe(myParser).on("data", (data) => {
    console.log(data);
  });
}
check();
