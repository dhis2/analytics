const { config } = require('@dhis2/cli-style')
const SEVERITY = 2

module.exports = {
    root: true,
    parser: 'babel-eslint',
    extends: [config.eslintReact],
    plugins: ['react-hooks'],
    env: {
        browser: true,
        node: true,
        jest: true,
    },
    parserOptions: {
        // latest standard is ok, eq. to 9
        ecmaVersion: 2018,
        ecmaFeatures: {
            jsx: true,
            modules: true,
        },
    },
    rules: {
        'max-params': [
            SEVERITY,
            {
                max: 3,
            },
        ],
        'prefer-const': [
            SEVERITY,
            {
                destructuring: 'any',
                ignoreReadBeforeAssign: false,
            },
        ],
        'no-mixed-spaces-and-tabs': [SEVERITY],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
    },
}
