export const parseValue = valueString => {
    const parsedValue = parseFloat(valueString)
    if (isNaN(parsedValue)) {
        return valueString
    }
    return parsedValue
}
