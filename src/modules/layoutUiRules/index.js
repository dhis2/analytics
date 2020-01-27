export {
    getAvailableAxesByVisType as getAvailableAxes,
    getDisallowedDimsByVisType as getDisallowedDimensions,
    getAxisMaxNumberOfItemsByVisType as getAxisMaxNumberOfItems,
    getAxisMaxNumberOfDimsByVisType as getAxisMaxNumberOfDimensions,
    getAxisMinNumberOfDimsByVisType as getAxisMinNumberOfDimensions,
    getAxisPerLockedDimByVisType as getAxisPerLockedDimension,
    getAllLockedDimIdsByVisType as getAllLockedDimensionIds,
} from './rulesHelper'

export {
    hasAxisTooManyItemsByVisType as hasAxisTooManyItems,
    isDimensionLockedByVisType as isDimensionLocked,
    isAxisFullByVisType as isAxisFull,
    canDimensionBeAddedToAxisByVisType as canDimensionBeAddedToAxis,
    getTransferableDimensionPerAxisByVisType as getTransferableDimension,
} from './rulesUtils'
