/* eslint-disable no-console */
'use strict';

const { Ignitor } = require('@adonisjs/core/build/standalone');
const { register } = require('@adonisjs/require-ts');
const NodeEnvironment = require('jest-environment-node');

const iocSymbol = Symbol.for('ioc.use');

let app;
let providersWithReadyHook;
let providersWithShutdownHook;

class AdonisEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    this.rootDir = config.projectConfig.rootDir;

    const options = {
      cache: true,
      transformers: {
        before: [],
        after: [{ transform: `${__dirname}/ioc-transformer.js` }],
        afterDeclarations: [],
      },
    };

    register(this.rootDir, options);
  }

  async createApplication() {
    if (!app) {
      const ignitor = new Ignitor(this.rootDir);
      app = ignitor.application('test');
      await app.setup();
      await app.registerProviders();
      await app.bootProviders();
      await app.requirePreloads();
      providersWithReadyHook = app.providersWithReadyHook;
      providersWithShutdownHook = app.providersWithShutdownHook;
    }
  }

  async setup() {
    await super.setup();
    // Set by Jest
    if (process.env.NODE_ENV === 'test') {
      process.env.NODE_ENV = 'testing';
    }
    try {
      await this.createApplication();
      app.providersWithReadyHook = providersWithReadyHook;
      app.providersWithShutdownHook = providersWithShutdownHook;
      await app.start();
      this.global[iocSymbol] = global[iocSymbol];
    } catch (e) {
      console.error('Error while setting up Adonis test environment');
      console.error(e);
      process.exit(1);
    }
  }

  async teardown() {
    await app.shutdown();
    app.isShuttingDown = false;
    app.state = 'booted';
    await super.teardown();
  }
}

module.exports = AdonisEnvironment;
