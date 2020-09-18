import { hasRelativeItems } from '..'
import {
    DIMENSION_ID_ASSIGNED_CATEGORIES,
    DIMENSION_ID_ORGUNIT,
    DIMENSION_ID_PERIOD,
} from '../../predefinedDimensions'

describe('relativeItems', () => {
    describe('hasRelativeItems', () => {
        it('returns false for no input', () => {
            expect(hasRelativeItems()).toBe(false)
        })
        it('returns false for no dimension and empty array', () => {
            expect(hasRelativeItems('', [])).toBe(false)
        })
        it('returns true for Assigned Categories and no input', () => {
            const dimension = DIMENSION_ID_ASSIGNED_CATEGORIES
            expect(hasRelativeItems(dimension)).toBe(true)
        })
        it('returns true for Assigned Categories and empty array', () => {
            const dimension = DIMENSION_ID_ASSIGNED_CATEGORIES
            const itemIds = []
            expect(hasRelativeItems(dimension, itemIds)).toBe(true)
        })
        it('returns false for period and no input', () => {
            const dimension = DIMENSION_ID_PERIOD
            expect(hasRelativeItems(dimension)).toBe(false)
        })
        it('returns false for period and no item ids', () => {
            const dimension = DIMENSION_ID_PERIOD
            const itemIds = []
            expect(hasRelativeItems(dimension, itemIds)).toBe(false)
        })
        it('returns false for period and object', () => {
            const dimension = DIMENSION_ID_PERIOD
            const itemIds = { id: 'dummy1' }
            expect(hasRelativeItems(dimension, itemIds)).toBe(false)
        })
        it('returns false for period and dummies', () => {
            const dimension = DIMENSION_ID_PERIOD
            const itemIds = ['202006', '202007']
            expect(hasRelativeItems(dimension, itemIds)).toBe(false)
        })
        it('returns true for period and LAST_12_MONTHS', () => {
            const dimension = DIMENSION_ID_PERIOD
            const itemIds = ['LAST_12_MONTHS']
            expect(hasRelativeItems(dimension, itemIds)).toBe(true)
        })
        it('returns true for period and LAST_MONTH and dummy items', () => {
            const dimension = DIMENSION_ID_PERIOD
            const itemIds = ['dummy1', 'LAST_MONTH', 'dummy2']
            expect(hasRelativeItems(dimension, itemIds)).toBe(true)
        })
        it('returns false for org unit and no input', () => {
            const dimension = DIMENSION_ID_ORGUNIT
            expect(hasRelativeItems(dimension)).toBe(false)
        })
        it('returns false for org unit and object', () => {
            const dimension = DIMENSION_ID_ORGUNIT
            const itemIds = { id: 'dummy1' }
            expect(hasRelativeItems(dimension, itemIds)).toBe(false)
        })
        it('returns false for org unit and no item ids', () => {
            const dimension = DIMENSION_ID_ORGUNIT
            const itemIds = []
            expect(hasRelativeItems(dimension, itemIds)).toBe(false)
        })
        it('returns true for org unit and LEVEL', () => {
            const dimension = DIMENSION_ID_ORGUNIT
            const itemIds = ['dummy1', 'LEVEL-dummy2']
            expect(hasRelativeItems(dimension, itemIds)).toBe(true)
        })
        it('returns true for org unit and OU_GROUP', () => {
            const dimension = DIMENSION_ID_ORGUNIT
            const itemIds = ['OU_GROUP-dummy1', 'dummy2']
            expect(hasRelativeItems(dimension, itemIds)).toBe(true)
        })
        it('returns false for org unit and dummies', () => {
            const dimension = DIMENSION_ID_ORGUNIT
            const itemIds = ['dummy1', 'dummy2']
            expect(hasRelativeItems(dimension, itemIds)).toBe(false)
        })
        it('returns true for org unit and USER_ORGUNIT_CHILDREN', () => {
            const dimension = DIMENSION_ID_ORGUNIT
            const itemIds = ['dummy1', 'USER_ORGUNIT_CHILDREN']
            expect(hasRelativeItems(dimension, itemIds)).toBe(true)
        })
    })
})
