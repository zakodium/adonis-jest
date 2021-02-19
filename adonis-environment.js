/* eslint-disable no-console */
'use strict';

const { Ignitor } = require('@adonisjs/core/build/standalone');
const { register } = require('@adonisjs/require-ts');
const NodeEnvironment = require('jest-environment-node');

const iocSymbol = Symbol.for('ioc.use');

class AdonisEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    this.rootDir = config.rootDir;
    this.app = null;

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

  async setup() {
    await super.setup();
    const ignitor = new Ignitor(this.rootDir);
    // Set by Jest
    if (process.env.NODE_ENV === 'test') {
      process.env.NODE_ENV = 'testing';
    }
    try {
      const app = ignitor.application('test');
      await app.setup();
      await app.registerProviders();
      await app.bootProviders();
      await app.requirePreloads();
      await app.start();
      this.app = app;
      this.global[iocSymbol] = global[iocSymbol];
    } catch (e) {
      console.error('Error while setting up Adonis test environment');
      console.error(e);
      process.exit(1);
    }
  }

  async teardown() {
    await this.app.shutdown();
    await super.teardown();
  }
}

module.exports = AdonisEnvironment;
