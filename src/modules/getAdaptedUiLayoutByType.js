import isObject from 'lodash/isObject'
import {
    DIMENSION_ID_DATA,
    DIMENSION_ID_ORGUNIT,
    DIMENSION_ID_PERIOD,
} from './predefinedDimensions'
import { AXIS_ID_COLUMNS, AXIS_ID_ROWS, AXIS_ID_FILTERS } from './layout/axis'
import {
    VIS_TYPE_YEAR_OVER_YEAR_LINE,
    VIS_TYPE_YEAR_OVER_YEAR_COLUMN,
    VIS_TYPE_PIE,
    VIS_TYPE_GAUGE,
    VIS_TYPE_SINGLE_VALUE,
    VIS_TYPE_PIVOT_TABLE,
    VIS_TYPE_SCATTER,
    isTwoCategoryChartType,
} from './visTypes'

export const getAdaptedUiLayoutByType = (layout, type) => {
    if (isTwoCategoryChartType(type) && layout.rows?.length > 1) {
        return getDualCategoryLayout(layout)
    }
    switch (type) {
        case VIS_TYPE_YEAR_OVER_YEAR_LINE:
        case VIS_TYPE_YEAR_OVER_YEAR_COLUMN: {
            return getYearOverYearLayout(layout)
        }
        case VIS_TYPE_PIE: {
            return getPieLayout(layout)
        }
        case VIS_TYPE_SINGLE_VALUE:
        case VIS_TYPE_GAUGE: {
            return getSingleValueLayout(layout)
        }
        case VIS_TYPE_PIVOT_TABLE:
            return layout
        case VIS_TYPE_SCATTER:
            return getScatterLayout(layout)
        default:
            return getDefaultLayout(layout)
    }
}

// Transform from ui.layout to default layout format
const getDefaultLayout = layout => {
    const columns = layout[AXIS_ID_COLUMNS].slice()
    const rows = layout[AXIS_ID_ROWS].slice()

    return {
        [AXIS_ID_COLUMNS]: columns.length ? [columns.shift()] : columns,
        [AXIS_ID_ROWS]: rows.length ? [rows.shift()] : rows,
        [AXIS_ID_FILTERS]: [...layout[AXIS_ID_FILTERS], ...columns, ...rows],
    }
}

const getDualCategoryLayout = layout => {
    const columns = layout[AXIS_ID_COLUMNS].slice()
    const rows = layout[AXIS_ID_ROWS].slice()

    return {
        [AXIS_ID_COLUMNS]: columns.length ? [columns.shift()] : columns,
        [AXIS_ID_ROWS]:
            rows.length > 2 ? rows.splice(0, 2) : rows.splice(0, rows.length),
        [AXIS_ID_FILTERS]: [...layout[AXIS_ID_FILTERS], ...columns, ...rows],
    }
}

// Transform from ui.layout to pie layout format
const getPieLayout = layout => {
    const columns = layout[AXIS_ID_COLUMNS].slice()
    const rows = layout[AXIS_ID_ROWS].slice()

    return {
        [AXIS_ID_COLUMNS]: columns.length
            ? [columns.shift()]
            : rows.length
            ? [rows.shift()]
            : [],
        [AXIS_ID_ROWS]: [],
        [AXIS_ID_FILTERS]: [...layout[AXIS_ID_FILTERS], ...columns, ...rows],
    }
}

const getYearOverYearLayout = layout => ({
    [AXIS_ID_COLUMNS]: [],
    [AXIS_ID_ROWS]: [],
    [AXIS_ID_FILTERS]: [
        ...layout[AXIS_ID_FILTERS],
        ...layout[AXIS_ID_COLUMNS],
        ...layout[AXIS_ID_ROWS],
    ].filter(dim => getDimensionId(dim) !== DIMENSION_ID_PERIOD),
})

const getScatterLayout = layout => ({
    [AXIS_ID_COLUMNS]: [DIMENSION_ID_DATA],
    [AXIS_ID_ROWS]: [DIMENSION_ID_ORGUNIT],
    [AXIS_ID_FILTERS]: [
        ...layout[AXIS_ID_COLUMNS],
        ...layout[AXIS_ID_ROWS],
        ...layout[AXIS_ID_FILTERS],
    ].filter(
        dim =>
            ![DIMENSION_ID_DATA, DIMENSION_ID_ORGUNIT].includes(
                getDimensionId(dim)
            )
    ),
})

// Transform from ui.layout to single value layout format
const getSingleValueLayout = layout => {
    const columns = layout[AXIS_ID_COLUMNS].slice()
    const rows = layout[AXIS_ID_ROWS].slice()
    const filters = layout[AXIS_ID_FILTERS].slice()

    let dxDimensionArr = []
    const clonedLayout = [columns, rows, filters]

    for (let i = 0; i < clonedLayout.length; ++i) {
        const axis = clonedLayout[i]
        for (let j = 0; j < axis.length; ++j) {
            const dimension = axis[j]
            if (getDimensionId(dimension) == DIMENSION_ID_DATA) {
                dxDimensionArr = axis.splice(j, 1)
                break
            }
        }
        if (dxDimensionArr.length > 0) {
            break
        }
    }

    return {
        [AXIS_ID_COLUMNS]: dxDimensionArr,
        [AXIS_ID_ROWS]: [],
        [AXIS_ID_FILTERS]: [...filters, ...columns, ...rows],
    }
}

/**
 *
 * @param {string|object} dimension
 * @returns {string}
 */
const getDimensionId = dimension => {
    return isObject(dimension) ? dimension.dimension : dimension
}
