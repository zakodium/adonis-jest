/* eslint-disable no-console */
'use strict';

const { Ignitor } = require('@adonisjs/core/build/standalone');
const { register } = require('@adonisjs/require-ts');
const NodeEnvironment = require('jest-environment-node');

const iocSymbol = Symbol.for('ioc.use');

let server;
let providersWithReadyHook;
let providersWithShutdownHook;

class AdonisEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    this.rootDir = config.rootDir;

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

  async createServer() {
    if (!server) {
      const ignitor = new Ignitor(this.rootDir);
      server = ignitor.httpServer();
      server.application.switchEnvironment('test');      
      providersWithReadyHook = server.application.providersWithReadyHook;
      providersWithShutdownHook = server.application.providersWithShutdownHook;
    }
  }

  async setup() {
    await super.setup();
    // Set by Jest
    if (process.env.NODE_ENV === 'test') {
      process.env.NODE_ENV = 'testing';
    }
    try {
      await this.createServer();
      server.application.providersWithReadyHook = providersWithReadyHook;
      server.application.providersWithShutdownHook = providersWithShutdownHook;
      await server.start();
      this.global[iocSymbol] = global[iocSymbol];
    } catch (e) {
      console.error('Error while setting up Adonis test environment');
      console.error(e);
      process.exit(1);
    }
  }

  async teardown() {
    await server.close();
    server.application.isShuttingDown = false;
    server.application.state = 'booted';
    await super.teardown();
  }
}

module.exports = AdonisEnvironment;
