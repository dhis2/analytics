module.exports = {
    testPathIgnorePatterns: ['/node_modules/', '/build/'],
    setupFilesAfterEnv: [
        '<rootDir>/config/setupEnzyme.js',
        '<rootDir>/config/setupTestingLibrary.js',
    ],
}
