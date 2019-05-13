import { DIMENSION_PROP_ID } from './dimension'

export const dimensionIs = (dimension, dimensionId) =>
    dimension[DIMENSION_PROP_ID.name] === dimensionId
