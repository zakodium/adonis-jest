'use strict';

const { join } = require('path');

const { rcParser } = require('@adonisjs/application');
const { iocTransformer } = require('@adonisjs/ioc-transformer');

module.exports = function getIocTransformer(ts, appRoot) {
  return iocTransformer(
    ts,
    // eslint-disable-next-line import/no-dynamic-require
    rcParser.parse(require(join(appRoot, '.adonisrc.json'))),
  );
};
