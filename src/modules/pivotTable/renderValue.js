import {
    NUMBER_TYPE_ROW_PERCENTAGE,
    NUMBER_TYPE_COLUMN_PERCENTAGE,
    VALUE_TYPE_NUMBER,
} from './pivotTableConstants'

const trimTrailingZeros = stringValue => stringValue.replace(/\.?0+$/, '')

const defaultDecimalSeparator = '.'

const separateDigitGroups = (stringValue, decimalSeparator) => {
    const isNegative = stringValue[0] === '-'
    const [integer, remainder] = stringValue.replace(/^-/, '').split('.')

    const groups = []
    for (let i = integer.length; i > 0; i -= 3) {
        groups.unshift(integer.substring(i - 3, i))
    }

    if (isNegative) {
        groups[0] = '-' + groups[0]
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

const toFixedPrecisionString = (value, skipRounding) => {
    if (typeof value !== 'number') {
        // Values returned from the server should keep their string representation
        return value
    }

    const precision = skipRounding ? 10 : value > -1 && value < 1 ? 2 : 1

    return value.toFixed(precision)
}

export const renderValue = (value, valueType, visualization) => {
    if (valueType !== VALUE_TYPE_NUMBER || value === undefined) {
        return value
    }

    if (
        visualization.numberType === NUMBER_TYPE_ROW_PERCENTAGE ||
        visualization.numberType === NUMBER_TYPE_COLUMN_PERCENTAGE
    ) {
        return (
            trimTrailingZeros(
                toFixedPrecisionString(value * 100, visualization.skipRounding)
            ) + '%'
        )
    }

    const stringValue = toFixedPrecisionString(
        value,
        visualization.skipRounding
    )

    const digitGroups = separateDigitGroups(
        stringValue,
        defaultDecimalSeparator
    )
    return digitGroups.join(getSeparator(visualization))
}
