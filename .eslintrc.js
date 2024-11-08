const { config } = require('@dhis2/cli-style')

module.exports = {
    extends: [config.eslintReact],
    rules: {
        'react/no-unknown-property': ['error', { ignore: ['jsx', 'global'] }],
    },
}
