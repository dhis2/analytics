import { DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM } from './dataTypes.js'
import { layoutGetAllItems } from './layout/layoutGetAllItems.js'

const testValue = (value) => typeof value === 'string' && value.length

// TODO: use crypto-es?
export const getHash = (input) => {
    let hashInput

    if (testValue(input)) {
        hashInput = input
    } else if (
        Array.isArray(input) &&
        input.every((value) => testValue(value))
    ) {
        hashInput = input.join('')
    }

    return hashInput ? window.btoa(hashInput) : undefined
}

export const getExpressionHashFromVisualization = (visualization) => {
    const items = layoutGetAllItems(visualization)

    const expressions = items
        .filter(
            (item) =>
                item.dimensionItemType ===
                    DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM &&
                typeof item.expression === 'string'
        )
        .sort((i1, i2) => (i1.id < i2.id ? -1 : i1.id > i2.id ? 1 : 0))
        .map((edi) => edi.expression)

    return getHash(expressions)
}
