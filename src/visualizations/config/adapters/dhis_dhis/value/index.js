import { INDICATOR_FACTOR_100 } from '../'
import { VALUE_TYPE_TEXT } from '../../../../../modules/pivotTable/pivotTableConstants'
import { renderValue } from '../../../../../modules/pivotTable/renderValue'

export default function (value, layout, metaData, extraOptions) {
    const valueType = metaData.items[metaData.dimensions.dx[0]].valueType
    const indicatorInfo =
        metaData.items[metaData.dimensions.dx[0]].indicatorInfo

    console.log('indicator info', indicatorInfo)

    let formattedValue =
        renderValue(value, valueType || VALUE_TYPE_TEXT, {
            digitGroupSeparator: layout.digitGroupSeparator,
            skipRounding: layout.skipRounding,
        }) || extraOptions.noData.text

    // only show the percentage symbol for per cent
    // for other factors, show the full text under the value
    if (indicatorInfo?.factor === INDICATOR_FACTOR_100) {
        formattedValue += ' %'
    }

    return formattedValue
}
