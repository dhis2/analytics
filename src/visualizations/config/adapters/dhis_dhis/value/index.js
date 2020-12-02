import { renderValue } from '../../../../../modules/pivotTable/renderValue'
import { VALUE_TYPE_TEXT } from '../../../../../modules/pivotTable/pivotTableConstants'

export default function (value, layout, metaData, extraOptions) {
    const valueType = metaData.items[metaData.dimensions.dx[0]].valueType
    return (
        renderValue(value, valueType || VALUE_TYPE_TEXT, {
            digitGroupSeparator: layout.digitGroupSeparator,
            skipRounding: layout.skipRounding,
        }) || extraOptions.noData.text
    )
}
