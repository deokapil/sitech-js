const assert = require('assert');
const app = require('../../src/app');

describe('\'transLogs\' service', () => {
  it('registered the service', () => {
    const service = app.service('trans-logs');

    assert.ok(service, 'Registered the service');
  });
});
