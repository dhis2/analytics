module.exports = {
    setupFilesAfterEnv: ['<rootDir>/config/setup.js'],
    testPathIgnorePatterns: ['node_modules'],
    verbose: true,
    transform: {
        '^.+\\.jsx$': 'babel-jest',
        '^.+\\.js$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'jsx'],
    moduleDirectories: ['node_modules'],
    moduleNameMapper: {
        '^.+\\.css$': '<rootDir>/config/css-stub.js',
    },
}
