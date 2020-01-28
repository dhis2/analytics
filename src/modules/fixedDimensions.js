import i18n from '@dhis2/d2-i18n'
import DataIcon from '../assets/DataIcon'
import PeriodIcon from '../assets/PeriodIcon'
import OrgUnitIcon from '../assets/OrgUnitIcon'
import AssignedCategoriesIcon from '../assets/AssignedCategoriesIcon'

export const DIMENSION_ID_DATA = 'dx'
export const DIMENSION_ID_PERIOD = 'pe'
export const DIMENSION_ID_ORGUNIT = 'ou'
export const DIMENSION_ID_ASSIGNED_CATEGORIES = 'co'

const FIXED_DIMENSIONS = {
    [DIMENSION_ID_DATA]: {
        id: DIMENSION_ID_DATA,
        name: i18n.t('Data'),
        iconName: 'DataIcon',
        icon: DataIcon,
    },
    [DIMENSION_ID_PERIOD]: {
        id: DIMENSION_ID_PERIOD,
        name: i18n.t('Period'),
        iconName: 'PeriodIcon',
        icon: PeriodIcon,
    },
    [DIMENSION_ID_ORGUNIT]: {
        id: DIMENSION_ID_ORGUNIT,
        name: i18n.t('Organisation Unit'),
        iconName: 'OrgUnitIcon',
        icon: OrgUnitIcon,
    },
    [DIMENSION_ID_ASSIGNED_CATEGORIES]: {
        id: DIMENSION_ID_ASSIGNED_CATEGORIES,
        name: i18n.t('Assigned Categories'),
        iconName: 'AssignedCategoriesIcon',
        icon: AssignedCategoriesIcon,
        noItems: true,
    },
}

export const filterOutPredefinedDimensions = dimensionIds =>
    dimensionIds.filter(
        dimensionId => !Object.keys(FIXED_DIMENSIONS).includes(dimensionId)
    )

export const getPredefinedDimensionProp = (dimensionId, propName) =>
    (FIXED_DIMENSIONS[dimensionId] || {})[propName]

export const getDimensionById = dimensionId => FIXED_DIMENSIONS[dimensionId]

export const getPredefinedDimensions = () => FIXED_DIMENSIONS
