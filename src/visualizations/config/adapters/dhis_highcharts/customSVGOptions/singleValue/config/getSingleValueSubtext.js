import { INDICATOR_FACTOR_100 } from './getSingleValueFormattedValue.js'

export function getSingleValueSubtext(metaData) {
    const indicatorType =
        metaData.items[metaData.dimensions.dx[0]].indicatorType

    return indicatorType?.displayName &&
        indicatorType?.factor !== INDICATOR_FACTOR_100
        ? indicatorType?.displayName
        : undefined
}
