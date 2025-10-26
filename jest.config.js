
/**
 * @type {import('jest').Config}
 * @type {import('ts-jest').JestConfigWithTsJest}
 */
export default {
  clearMocks: true,
  collectCoverage: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  // setupFilesAfterEnv: ["<rootDir>/tests/prisma-setup.ts"],
  // globalSetup: "<rootDir>/tests/test-setup.ts",
  // globalTeardown: "<rootDir>/tests/test-teardown.ts"
};
