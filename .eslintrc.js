/* eslint-disable unicorn/prefer-module */
const configuration = require('./config').eslint

configuration.ignorePatterns = ['packages/nuxt/src/api-schema/index.ts']

module.exports = configuration
