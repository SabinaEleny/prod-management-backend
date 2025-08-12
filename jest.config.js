module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    setupFiles: ['dotenv/config'],
    setupFilesAfterEnv: ['./src/test-setup.ts'],
    clearMocks: true,
};
