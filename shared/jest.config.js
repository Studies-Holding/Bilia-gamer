/** Config Jest — shared (types, logger, middleware) */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: ['logger/**/*.ts', 'middleware/**/*.ts', '!**/*.d.ts'],
  clearMocks: true,
  globals: {
    'ts-jest': { tsconfig: 'tsconfig.jest.json' },
  },
};
