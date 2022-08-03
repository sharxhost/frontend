const { createConfig } = require('eslint-config-galex/dist/createConfig');
const { getDependencies } = require('eslint-config-galex/dist/getDependencies');
const {
  createTypeScriptOverride,
} = require('eslint-config-galex/dist/overrides/typescript');

const dependencies = getDependencies();

const customTypescriptOverride = createTypeScriptOverride({
  ...dependencies,
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
  },
});

module.exports = createConfig({
  overrides: customTypescriptOverride,
  rules: {
    "import/no-default-export": "off"
  }
});