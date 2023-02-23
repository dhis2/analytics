import Crypto from 'crypto-js'
import { DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM } from './dataTypes.js'
import { layoutGetAllItems } from './layout/layoutGetAllItems.js'

const isValid = (value) => typeof value === 'string' && value.length

export const getHash = (value) =>
    isValid(value) ? Crypto.SHA1(value).toString() : undefined

export const getExpressionHashFromVisualization = (visualization) =>
    getHash(
        layoutGetAllItems(visualization)
            ?.filter(
                (item) =>
                    item.dimensionItemType ===
                        DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM &&
                    isValid(item.expression)
            )
            .sort((i1, i2) => (i1.id < i2.id ? -1 : i1.id > i2.id ? 1 : 0))
            .map((edi) => edi.expression)
            .join('')
    )
