const config = function(api) {
    api.cache.forever()

    let defaultPresets

    if (process.env.BABEL_ENV === 'modules') {
        defaultPresets = []
    } else {
        defaultPresets = [
            [
                '@babel/preset-env',
                {
                    modules: 'commonjs',
                },
            ],
        ]
    }

    return {
        presets: defaultPresets.concat('@babel/preset-react'),
        plugins: [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-transform-react-constant-elements',
            'styled-jsx/babel',
        ],
    }
}

console.log(
    'babel config',
    config({
        cache: {
            forever: () => {},
        },
    })
)

module.exports = config
