import { dimensionGetItems } from '../layout/dimensionGetItems'
import { layoutReplaceDimension } from '../layout/layoutReplaceDimension'
import { layoutGetDimension } from '../layout/layoutGetDimension'

import { ouIdHelper } from '../ouIdHelper'
import { DIMENSION_ID_ORGUNIT } from '../predefinedDimensions'

const isOuLevelIntId = id =>
    ouIdHelper.hasLevelPrefix(id)
        ? Number.isInteger(parseInt(ouIdHelper.removePrefix(id), 10))
        : false

const replaceNumericOuLevelWithUid = ouLevels => item => {
    if (!isOuLevelIntId(item.id)) {
        return item
    }

    const ouIntId = parseInt(ouIdHelper.removePrefix(item.id), 10)
    const ouUid = ouLevels.find(l => parseInt(l.level, 10) === ouIntId).id

    return Object.assign({}, item, { id: ouIdHelper.addLevelPrefix(ouUid) })
}

export const convertOuLevelsToUids = (ouLevels, layout) => {
    const ouDimension = layoutGetDimension(layout, DIMENSION_ID_ORGUNIT)

    const hasNumericOuLevels =
        ouDimension &&
        dimensionGetItems(ouDimension).some(item => isOuLevelIntId(item.id))

    if (hasNumericOuLevels) {
        const replaceNumericOuLevel = replaceNumericOuLevelWithUid(ouLevels)

        const updatedOuItems = dimensionGetItems(ouDimension).map(
            replaceNumericOuLevel
        )

        return layoutReplaceDimension(
            layout,
            DIMENSION_ID_ORGUNIT,
            updatedOuItems
        )
    }

    return layout
}
