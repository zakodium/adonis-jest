'use strict';

const { iocTransformer } = require('@adonisjs/ioc-transformer');
const ts = require('typescript');

class AdonisTransformer {
  constructor() {
    this.canInstrument = false;
    this.baseTranspileOptions = null;
  }

  init(options) {
    if (this.baseTranspileOptions !== null) {
      return;
    }
    const {
      config: { rootDir },
    } = options;
    const transformer = iocTransformer(
      ts,
      require(`${rootDir}/.adonisrc.json`),
    );
    const compilerOptions = ts.getParsedCommandLineOfConfigFile(
      `${rootDir}/tsconfig.json`,
      {},
      {
        ...ts.sys,
        useCaseSensitiveFileNames: true,
        getCurrentDirectory() {
          return rootDir;
        },
        onUnRecoverableConfigFileDiagnostic(diagnostic) {
          // eslint-disable-next-line no-console
          console.error(diagnostic);
          process.exit(1);
        },
      },
    ).options;

    this.baseTranspileOptions = {
      compilerOptions,
      transformers: {
        after: [transformer],
      },
    };
  }

  process(sourceText, sourcePath, options) {
    this.init(options);
    const transpiled = ts.transpileModule(sourceText, {
      ...this.baseTranspileOptions,
      fileName: sourcePath,
    });
    return { code: transpiled.outputText, map: transpiled.sourceMapText };
  }
}

module.exports = {
  createTransformer() {
    return new AdonisTransformer();
  },
};
