import { VALUE_TYPE_TEXT } from '../../../../../modules/pivotTable/pivotTableConstants.js'
import { renderValue } from '../../../../../modules/pivotTable/renderValue.js'
import { INDICATOR_FACTOR_100 } from '../index.js'

export default function (value, layout, metaData) {
    const valueType = metaData.items[metaData.dimensions.dx[0]].valueType
    const indicatorType =
        metaData.items[metaData.dimensions.dx[0]].indicatorType

    let formattedValue = renderValue(value, valueType || VALUE_TYPE_TEXT, {
        digitGroupSeparator: layout.digitGroupSeparator,
        skipRounding: layout.skipRounding,
    })

    // only show the percentage symbol for per cent
    // for other factors, show the full text under the value
    if (indicatorType?.factor === INDICATOR_FACTOR_100) {
        formattedValue += '%'
    }

    return formattedValue
}
