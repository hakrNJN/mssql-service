// jest.config.js

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    clearMocks: true,
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],

    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.spec.json'
        }
    },

    // -- THIS IS THE FINAL FIX --
    // This line explicitly tells Jest where to find the module, bypassing the
    // package.json "exports" issue that causes the "Cannot find module" error.
    moduleNameMapper: {
        '^aws-sdk-client-mock-jest$': '<rootDir>/node_modules/aws-sdk-client-mock-jest/dist/cjs/jest.js',
    }
};
