const users = require('./users/users.service.js');
const transLogs = require('./trans-logs/trans-logs.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(transLogs);
};
