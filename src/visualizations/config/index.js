import validators from './validators'
import adapters from './adapters'
import generators from './generators'
import { theme1 } from '../util/colors'

const DEFAULT_EXTRA_OPTIONS = {
    colors: theme1,
    noData: {
        text: 'No data to display',
    },
}

export default function({
    store,
    layout,
    el,
    inputFormat = 'dhis',
    outputFormat = 'highcharts',
    extraLayout,
    extraOptions,
    onError,
    onWarning,
}) {
    const _validator = validators[inputFormat] || validators.noValidation
    const _adapter = adapters[inputFormat + '_' + outputFormat]
    const _generator = generators[outputFormat]

    if (_validator === validators.noValidation) {
        onWarning(
            `No validation implementation for config input format "${inputFormat}"`
        )
    }

    if (!_adapter) {
        onError(
            `No config tranformation implementation for format "${inputFormat}" to format "${outputFormat}"`
        )
    }

    if (!_generator) {
        onError(`No visualization implementation for format ${outputFormat}`)
    }

    this.getConfig = () => {
        return _adapter({
            layout: _validator({ layout, onError, onWarning }),
            extraOptions: Object.assign(
                {},
                DEFAULT_EXTRA_OPTIONS,
                extraOptions
            ),
            store,
            el,
            extraLayout,
        })
    }

    this.createVisualization = () =>
        _generator(this.getConfig(), el, extraOptions)
}
