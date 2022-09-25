// Initializes the `transLogs` service on path `/trans-logs`
const { TransLogs } = require('./trans-logs.class');
const createModel = require('../../models/trans-logs.model');
const hooks = require('./trans-logs.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/trans-logs', new TransLogs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('trans-logs');

  service.hooks(hooks);
};
