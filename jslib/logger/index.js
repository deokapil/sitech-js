const devLogger = require("./devLogger");
const prodLogger = require("./prodLogger");

let logger = null;

console.log(process.env);
if (process.env.NODE_ENV === "dev") {
  logger = devLogger();
}

if (process.env.NODE_ENV === "prod") {
  logger = prodLogger();
}

module.exports = logger;
