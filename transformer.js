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
    const { rootDir } = options;
    const transformer = iocTransformer(
      ts,
      require(rootDir + '/.adonisrc.json'),
    );
    const compilerOptions = ts.getParsedCommandLineOfConfigFile(
      rootDir + '/tsconfig.json',
      {},
      {
        ...ts.sys,
        useCaseSensitiveFileNames: true,
        getCurrentDirectory() {
          return rootDir;
        },
        onUnRecoverableConfigFileDiagnostic() {},
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
    return ts.transpileModule(sourceText, {
      ...this.baseTranspileOptions,
      fileName: sourcePath,
    }).outputText;
  }
}

module.exports = {
  createTransformer() {
    return new AdonisTransformer();
  },
};
