/* eslint-disable prefer-const */

import validators from './validators'
import adapters from './adapters'

export default function({
    data,
    inputFormat = 'dhis',
    outputFormat = 'highcharts',
    seriesId,
    categoryId,
    error,
    warning,
}) {
    let _validator = validators[inputFormat] || validators.noValidation
    let _adapter = adapters[inputFormat + '_' + outputFormat]

    if (_validator === validators.noValidation) {
        warning(
            `Validation not supported for data input format "${inputFormat}"`
        )
    }

    if (!_adapter) {
        error(
            `Data tranformation from "${inputFormat}" to "${outputFormat}" is not supported`
        )
    }

    this.data = data

    this.generateData = ({
        type,
        seriesId = seriesId,
        categoryId = categoryId,
    }) => {
        return _adapter({
            type,
            data: data.map(d => _validator({ data: d, error, warning })),
            seriesId,
            categoryId,
        })
    }
}
