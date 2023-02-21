import { DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM } from './dataTypes.js'
import { layoutGetAllItems } from './layout/layoutGetAllItems.js'

// TODO: use crypto-es?
const hash = (value) => window.btoa(value)

const testValue = (value) => typeof value === 'string' && value.length

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

    return hashInput ? hash(hashInput) : undefined
}

export const getExpressionHashFromVisualization = (visualization) =>
    getHash(
        layoutGetAllItems(visualization)
            ?.filter(
                (item) =>
                    item.dimensionItemType ===
                        DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM &&
                    testValue(item.expression)
            )
            .sort((i1, i2) => (i1.id < i2.id ? -1 : i1.id > i2.id ? 1 : 0))
            .map((edi) => edi.expression)
    )
