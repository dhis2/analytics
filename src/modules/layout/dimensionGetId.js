import { DIMENSION_PROP_ID, DIMENSION_PROP_PROGRAM_STAGE } from './dimension.js'

export const dimensionGetId = (dimension) =>
    dimension[DIMENSION_PROP_PROGRAM_STAGE.name]?.id
        ? `${dimension[DIMENSION_PROP_PROGRAM_STAGE.name].id}.${
              dimension[DIMENSION_PROP_ID.name]
          }`
        : dimension[DIMENSION_PROP_ID.name]
