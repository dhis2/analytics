const trimTrailingZeros = stringValue => stringValue.replace(/0+$/, '')

const separateDigitGroups = (stringValue, decimalSeparator = '.') => {
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

export const renderValue = (value, visualization) => {
    // TODO: check dataType in header instead of parsing here
    if (isNaN(parseFloat(value))) {
        return value
    }

    switch (visualization.digitGroupSeparator) {
        case 'SPACE':
            return separateDigitGroups(value.toString()).join(' ')
        case 'COMMA':
            return separateDigitGroups(value.toString()).join(',')
        // TODO: Requires backend support, and decimalSeparator should be separately configurable
        // case 'PERIOD':
        //     return separateDigitGroups(value, ',').join('.')
        case 'NONE':
        default:
            return value
    }
}
