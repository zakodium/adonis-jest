const { Ignitor } = require('@adonisjs/core/build/standalone');
const Module = require('module');

function setupTestApplication(root) {
  // @ts-expect-error
  Module._extensions['.ts'] = Module._extensions['.js'];
  const ignitor = new Ignitor(root);
  // Set by Jest
  if (process.env.NODE_ENV === 'test') {
    process.env.NODE_ENV = 'testing';
  }
  const app = ignitor.application('test');

  beforeAll(async () => {
    await app.setup();
    await app.registerProviders();
    await app.bootProviders();
    await app.requirePreloads();
    await app.start();
  });

  afterAll(async () => {
    await app.shutdown();
  });
}

module.exports = {
  setupTestApplication,
};
