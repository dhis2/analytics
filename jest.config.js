module.exports = {
    testPathIgnorePatterns: ['/node_modules/', '/build/'],
    setupFiles: ['<rootDir>/config/setupJest.js'],
    setupFilesAfterEnv: ['<rootDir>/config/setupTestingLibrary.js'],
}
