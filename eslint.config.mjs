import { defineConfig } from 'eslint/config';
import { globals } from 'eslint-config-zakodium';
import js from 'eslint-config-zakodium/js';

export default defineConfig(js, {
  files: ['**/*.js'],
  languageOptions: {
    sourceType: 'commonjs',
    globals: globals.node,
  },
});
