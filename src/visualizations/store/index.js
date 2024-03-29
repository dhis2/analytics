import adapters from './adapters/index.js'
import validators from './validators/index.js'

export default function ({
    data,
    inputFormat = 'dhis',
    outputFormat = 'highcharts',
    seriesId: initialSeriesId,
    categoryId: initialCategoryId,
    error,
    warning,
}) {
    const _validator = validators[inputFormat] || validators.noValidation
    const _adapter = adapters[inputFormat + '_' + outputFormat]

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
        seriesId = initialSeriesId,
        categoryIds = [initialCategoryId],
        extraOptions = {},
    }) => {
        return _adapter({
            type,
            data: data.map((d) => _validator({ data: d, error, warning })),
            seriesId,
            categoryIds,
            extraOptions,
        })
    }
}
