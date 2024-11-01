import {
    NUMBER_TYPE_ROW_PERCENTAGE,
    NUMBER_TYPE_COLUMN_PERCENTAGE,
} from './pivotTable/pivotTableConstants.js'
import { isNumericValueType, isBooleanValueType } from './valueTypes.js'

const trimTrailingZeros = (stringValue) => stringValue.replace(/\.?0+$/, '')

export const separateDigitGroups = (stringValue, decimalSeparator = '.') => {
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

const getSeparator = (visualization) => {
    switch (visualization.digitGroupSeparator) {
        case 'SPACE':
            return ' '
        case 'COMMA':
            return ','
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

    const precision = skipRounding ? 10 : 2

    return value.toFixed(precision)
}

export const renderValue = (value, valueType, visualization) => {
    if (
        !(isNumericValueType(valueType) || isBooleanValueType(valueType)) ||
        value === undefined
    ) {
        return String(value).replace(/[^\S\n]+/, ' ')
    }

    if (
        visualization.numberType === NUMBER_TYPE_ROW_PERCENTAGE ||
        visualization.numberType === NUMBER_TYPE_COLUMN_PERCENTAGE
    ) {
        const stringValue = trimTrailingZeros(
            toFixedPrecisionString(value * 100, visualization.skipRounding)
        )

        return (
            separateDigitGroups(stringValue).join(getSeparator(visualization)) +
            '%'
        )
    } else {
        const stringValue = toFixedPrecisionString(
            value,
            visualization.skipRounding
        )

        return separateDigitGroups(stringValue).join(
            getSeparator(visualization)
        )
    }
}
