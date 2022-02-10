/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
const { pathsToModuleNameMapper } = require('ts-jest/utils')
const { compilerOptions } = require('./tsconfig.json')

module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',

  // jest cant load custom module paths from typescript, so moduleNameMapper is required
  // more here: https://kulshekhar.github.io/ts-jest/docs/getting-started/paths-mapping/
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
};
