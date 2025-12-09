/** @type {import('jest').Config} */
module.exports = {
  preset: '@repo/jest-presets/node',

  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.test.ts'],

  extensionsToTreatAsEsm: ['.ts'],

  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
  },

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  testTimeout: 60000,
  maxWorkers: 1,
  detectOpenHandles: true,
}
