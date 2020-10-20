import { layoutGetAdaptedLayoutForType } from '../layoutGetAdaptedLayoutForType'
import { AXIS_ID_COLUMNS, AXIS_ID_ROWS, AXIS_ID_FILTERS } from '../axis'
import {
    VIS_TYPE_COLUMN,
    VIS_TYPE_YEAR_OVER_YEAR_LINE,
    VIS_TYPE_BAR,
    VIS_TYPE_PIE,
} from '../../visTypes'
import {
    DIMENSION_ID_DATA,
    DIMENSION_ID_PERIOD,
    DIMENSION_ID_ORGUNIT,
} from '../../predefinedDimensions'

const someId = 'someId'
const otherId = 'otherId'

describe('layoutGetAdaptedLayoutForType', () => {
    it('column: moves all extra dimensions in columns and rows to filters', () => {
        const initialState = {
            [AXIS_ID_COLUMNS]: [DIMENSION_ID_DATA, someId],
            [AXIS_ID_ROWS]: [],
            [AXIS_ID_FILTERS]: [
                DIMENSION_ID_PERIOD,
                DIMENSION_ID_ORGUNIT,
                otherId,
            ],
        }

        const actualState = layoutGetAdaptedLayoutForType(
            initialState,
            VIS_TYPE_COLUMN
        )

        const expectedState = {
            [AXIS_ID_COLUMNS]: [DIMENSION_ID_DATA],
            [AXIS_ID_ROWS]: [],
            [AXIS_ID_FILTERS]: [
                DIMENSION_ID_PERIOD,
                DIMENSION_ID_ORGUNIT,
                otherId,
                someId,
            ],
        }

        expect(actualState).toEqual(expectedState)
    })

    it('dualCategory: should keep the 2nd category in rows and move the others to filters (if any),', () => {
        const initialState = {
            [AXIS_ID_COLUMNS]: [DIMENSION_ID_DATA],
            [AXIS_ID_ROWS]: [DIMENSION_ID_PERIOD, otherId, someId],
            [AXIS_ID_FILTERS]: [DIMENSION_ID_ORGUNIT],
        }

        const actualState = layoutGetAdaptedLayoutForType(
            initialState,
            VIS_TYPE_BAR
        )

        const expectedState = {
            [AXIS_ID_COLUMNS]: [DIMENSION_ID_DATA],
            [AXIS_ID_ROWS]: [DIMENSION_ID_PERIOD, otherId],
            [AXIS_ID_FILTERS]: [DIMENSION_ID_ORGUNIT, someId],
        }

        expect(actualState).toEqual(expectedState)
    })

    it('pie: moves all column and row dimensions to filter except the first column dimension', () => {
        const initialState = {
            [AXIS_ID_COLUMNS]: [DIMENSION_ID_DATA, someId],
            [AXIS_ID_ROWS]: [DIMENSION_ID_PERIOD, otherId],
            [AXIS_ID_FILTERS]: [DIMENSION_ID_ORGUNIT],
        }

        const actualState = layoutGetAdaptedLayoutForType(
            initialState,
            VIS_TYPE_PIE
        )

        const expectedState = {
            [AXIS_ID_COLUMNS]: [DIMENSION_ID_DATA],
            [AXIS_ID_ROWS]: [],
            [AXIS_ID_FILTERS]: [
                DIMENSION_ID_ORGUNIT,
                someId,
                DIMENSION_ID_PERIOD,
                otherId,
            ],
        }

        expect(actualState).toEqual(expectedState)
    })

    it('pie: moves the first row dimension to series and the rest to filter', () => {
        const initialState = {
            [AXIS_ID_COLUMNS]: [],
            [AXIS_ID_ROWS]: [DIMENSION_ID_DATA, DIMENSION_ID_PERIOD, someId],
            [AXIS_ID_FILTERS]: [DIMENSION_ID_ORGUNIT],
        }

        const actualState = layoutGetAdaptedLayoutForType(
            initialState,
            VIS_TYPE_PIE
        )

        const expectedState = {
            [AXIS_ID_COLUMNS]: [DIMENSION_ID_DATA],
            [AXIS_ID_ROWS]: [],
            [AXIS_ID_FILTERS]: [
                DIMENSION_ID_ORGUNIT,
                DIMENSION_ID_PERIOD,
                someId,
            ],
        }

        expect(actualState).toEqual(expectedState)
    })

    it('yoy: removes the "pe" dimension and moves all other dimensions to filter', () => {
        const initialState = {
            [AXIS_ID_COLUMNS]: [DIMENSION_ID_DATA, someId],
            [AXIS_ID_ROWS]: [DIMENSION_ID_PERIOD, otherId],
            [AXIS_ID_FILTERS]: [DIMENSION_ID_ORGUNIT],
        }

        const actualState = layoutGetAdaptedLayoutForType(
            initialState,
            VIS_TYPE_YEAR_OVER_YEAR_LINE
        )

        const expectedState = {
            [AXIS_ID_COLUMNS]: [],
            [AXIS_ID_ROWS]: [],
            [AXIS_ID_FILTERS]: [
                DIMENSION_ID_ORGUNIT,
                DIMENSION_ID_DATA,
                someId,
                otherId,
            ],
        }

        expect(actualState).toEqual(expectedState)
    })
})
