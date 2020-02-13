const DEFAULT_PRECISION = 1,
    SMALL_NUMBER_PRECISION = 2,
    SKIP_ROUNDING_PRECISION = 10

const separateDigitGroups = (stringValue, decimalSeparator = '.') => {
    const [integer, remainder] = stringValue.split('.')

    const groups = []
    for (let i = integer.length; i > 0; i -= 3) {
        groups.unshift(integer.substring(i - 3, i))
    }

    if (remainder) {
        groups[groups.length - 1] += decimalSeparator + remainder
    }

    return groups
}

export const renderValue = (value, visualization) => {
    const precision = visualization.skipRounding
        ? SKIP_ROUNDING_PRECISION
        : value < 1 && value > -1
        ? SMALL_NUMBER_PRECISION
        : DEFAULT_PRECISION

    if (isNaN(value)) {
        return value
    }

    const stringValue = parseFloat(value.toFixed(precision)).toString() // TODO: This rounds and maybe it shouldn't!

    switch (visualization.digitGroupSeparator) {
        case 'SPACE':
            return separateDigitGroups(stringValue).join(' ')
        case 'COMMA':
            return separateDigitGroups(stringValue).join(',')
        // TODO: Requires backend support, and decimalSeparator should be separately configurable
        // case 'PERIOD':
        //     return separateDigitGroups(stringValue, ',').join('.')
        case 'NONE':
        default:
            return stringValue
    }
}
