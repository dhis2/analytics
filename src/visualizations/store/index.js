import validators from './validators'
import adapters from './adapters'

import { PivotTableEngine } from '../../modules/pivotTable/PivotTableEngine'

export default function({
    data,
    visualization,
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

    this.engine = new PivotTableEngine(visualization, data[0].response)
    console.log('engine', this.engine)

    this.generateData = ({
        type,
        seriesId = initialSeriesId,
        categoryIds = [initialCategoryId],
    }) => {
        return _adapter({
            type,
            data: data.map(d => _validator({ data: d, error, warning })),
            seriesId,
            categoryIds,
            engine: this.engine,
        })
    }
}
