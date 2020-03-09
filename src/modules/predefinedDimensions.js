import i18n from '@dhis2/d2-i18n'
import DataIcon from '../assets/DataIcon'
import PeriodIcon from '../assets/PeriodIcon'
import OrgUnitIcon from '../assets/OrgUnitIcon'
import AssignedCategoriesIcon from '../assets/AssignedCategoriesIcon'

export const DIMENSION_ID_DATA = 'dx'
export const DIMENSION_ID_PERIOD = 'pe'
export const DIMENSION_ID_ORGUNIT = 'ou'
export const DIMENSION_ID_ASSIGNED_CATEGORIES = 'co'
export const DIMENSION_PROP_NO_ITEMS = 'noItems'

export const DIMENSION_TYPE_DATA_ELEMENT_GROUP_SET = 'DATA_ELEMENT_GROUP_SET'

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
}

const DYNAMIC_DIMENSIONS = {
    [DIMENSION_ID_ASSIGNED_CATEGORIES]: {
        id: DIMENSION_ID_ASSIGNED_CATEGORIES,
        name: i18n.t('Assigned Categories'),
        iconName: 'AssignedCategoriesIcon',
        icon: AssignedCategoriesIcon,
        [DIMENSION_PROP_NO_ITEMS]: true,
    },
}

const PREDEFINED_DIMENSIONS = {
    ...FIXED_DIMENSIONS,
    ...DYNAMIC_DIMENSIONS,
}

export const filterOutPredefinedDimensions = dimensionIds =>
    dimensionIds.filter(
        dimensionId => !Object.keys(PREDEFINED_DIMENSIONS).includes(dimensionId)
    )

export const getPredefinedDimensionProp = (dimensionId, propName) =>
    (PREDEFINED_DIMENSIONS[dimensionId] || {})[propName]

export const getDimensionById = dimensionId =>
    PREDEFINED_DIMENSIONS[dimensionId]

export const getPredefinedDimensions = () => PREDEFINED_DIMENSIONS

export const getFixedDimensions = () => FIXED_DIMENSIONS

export const getDynamicDimensions = () => DYNAMIC_DIMENSIONS
