const makeBabelConfig = require('@dhis2/cli-app-scripts/config/makeBabelConfig.js')

module.exports = {
    addons: ['@storybook/preset-create-react-app'],
    stories: ['../src/__demo__/**/*.stories.@(js)'],

    babel: async (config) => {
        // currently styled-jsx is configured the same way for prod and
        // dev so it doesn't matter what the mode is here.
        const mode = 'production'

        const custom = makeBabelConfig({
            moduleType: 'es',
            mode,
        })

        // ensure that our custom babel configuration is merged properly
        // with the storybook babel configuration.
        return {
            ...config,
            presets: custom.presets,
            plugins: [...custom.plugins, ...custom.env[mode].plugins].map(
                (plugin) => {
                    if (plugin instanceof Array) {
                        return [plugin[0], { ...plugin[1], loose: true }]
                    }

                    return [plugin, { loose: true }]
                }
            ),
        }
    },

    framework: {
        name: '@storybook/react-webpack5',
        options: {},
    },

    docs: {},

    typescript: {
        reactDocgen: 'react-docgen-typescript',
    },
}
