import { getSingleValueFormattedValue } from './getSingleValueFormattedValue.js'
import { getSingleValueSubtext } from './getSingleValueSubtext.js'

export function getSingleValueCustomSVGOptions({
    layout,
    extraOptions,
    metaData,
    series,
}) {
    const { dashboard, icon } = extraOptions
    const value = series[0]
    return {
        value,
        formattedValue: getSingleValueFormattedValue(value, layout, metaData),
        icon,
        dashboard,
        subText: getSingleValueSubtext(metaData),
    }
}
