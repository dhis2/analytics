const trimTrailingZeros = stringValue => stringValue.replace(/0+$/, '')

const defaultDecimalSeparator = '.'

const separateDigitGroups = (stringValue, decimalSeparator) => {
    const [integer, remainder] = stringValue.split('.')

    const groups = []
    for (let i = integer.length; i > 0; i -= 3) {
        groups.unshift(integer.substring(i - 3, i))
    }

    if (remainder) {
        const trimmedRemainder = trimTrailingZeros(remainder)
        if (trimmedRemainder.length) {
            groups[groups.length - 1] += decimalSeparator + remainder
        }
    }

    return groups
}

const getSeparator = visualization => {
    switch (visualization.digitGroupSeparator) {
        case 'SPACE':
            return ' '
        case 'COMMA':
            return ','
        // TODO: Requires backend support, and decimalSeparator would need to be separately configurable
        // case 'PERIOD':
        //     return '.'
        case 'NONE':
        default:
            return ''
    }
}

export const renderValue = (value, visualization) => {
    // TODO: check dataType in header instead of parsing here
    if (isNaN(parseFloat(value))) {
        return value
    }

    const digitGroups = separateDigitGroups(value, defaultDecimalSeparator)
    return digitGroups.join(getSeparator(visualization))
}
