import { formatDimension } from '../../api/analytics/utils.js'
import {
    DIMENSION_PROP_ID,
    DIMENSION_PROP_PROGRAM_STAGE,
    DIMENSION_PROP_PROGRAM,
} from './dimension.js'

export const dimensionGetId = (dimension, outputType) =>
    formatDimension({
        dimension: dimension[DIMENSION_PROP_ID.name],
        programId: dimension[DIMENSION_PROP_PROGRAM.name]?.id,
        programStageId: dimension[DIMENSION_PROP_PROGRAM_STAGE.name]?.id,
        outputType,
    })
