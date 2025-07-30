/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import { pathsToModuleNameMapper } from 'ts-jest'
import * as tsconfig from './tsconfig.json' with { type: 'json' }

const { compilerOptions } = tsconfig.default

/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': ['ts-jest'],
  },
  testMatch: ['**/*.test.ts'],
  // TS Alias resolver
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src/',
  }),

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/'],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  coverageThreshold: {
    global: {
      lines: 90,
    },
  },

  // clearMocks: true,
  // resetMocks: true,
  // restoreMocks: true,

  // A list of paths to directories that Jest should use to search for files in
  roots: ['<rootDir>/src'],
}

export default config
