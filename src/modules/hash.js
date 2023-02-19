import { layoutGetAllItems } from './layout/layoutGetAllItems.js'

// TODO: use crypto-es?
export const getHash = (value) => {
    let hashInput

    if (['string', 'number'].includes(typeof value)) {
        hashInput = value
    } else if (Array.isArray(value)) {
        hashInput = value.join('')
    }

    return hashInput === undefined ? hashInput : window.btoa(value)
}

export const getHashFromVisualization = (visualization) => {
    const items = layoutGetAllItems(visualization)

    const expressions = items
        .filter(
            (item) => item.dimensionItemType === 'EXPRESSION_DIMENSION_ITEM'
        )
        .sort((i1, i2) => (i1 < i2 ? -1 : i1 > i2 ? 1 : 0))
        .map((edi) => edi.expression)

    return getHash(expressions)
}
