import {
    testResourceRules,
    testResourceRequiredProps,
    RULE_PROP_AVAILABLE_AXES,
    RULE_PROP_DISALLOWED_DIMS,
    RULE_PROP_MAX_DIMS_PER_AXIS,
    RULE_PROP_MAX_ITEMS_PER_AXIS,
    RULE_PROP_LOCKED_DIMS,
} from '../rules'
import { ALL_AXIS_IDS } from '../../layout/axis'
import { DIMENSION_ID_DATA, DIMENSION_ID_PERIOD } from '../../fixedDimensions'

import isObject from 'lodash/isObject'

const lockableDims = [DIMENSION_ID_DATA, DIMENSION_ID_PERIOD]
const disallowableDims = [DIMENSION_ID_DATA, DIMENSION_ID_PERIOD]

const allArrayItemsAreValid = (allItems, validItems) =>
    allItems.every(value => validItems.includes(value))

const allArrayItemsAreValidAxisIds = array =>
    allArrayItemsAreValid(array, ALL_AXIS_IDS)

const noObjectValuesAreZero = object =>
    Object.values(object).every(value => value !== 0)

const noObjectValuesAreNegative = object =>
    Object.values(object).every(value => value >= 0)

describe('verify all rules', () => {
    it('implement all required props', () => {
        expect(
            testResourceRules.every(rule =>
                testResourceRequiredProps.every(
                    val => Object.keys(rule).indexOf(val) !== -1
                )
            )
        ).toBe(true)
    })
})

describe('verify maxNumberOfDimsPerAxis', () => {
    const rule_prop = RULE_PROP_MAX_DIMS_PER_AXIS

    it('key should be valid axis id', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[rule_prop] ||
                    allArrayItemsAreValidAxisIds(Object.keys(rule[rule_prop]))
            )
        ).toBe(true)
    })

    it('value should not be 0', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[rule_prop] || noObjectValuesAreZero(rule[rule_prop])
            )
        ).toBe(true)
    })

    it('value should not be negative', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[rule_prop] ||
                    noObjectValuesAreNegative(rule[rule_prop])
            )
        ).toBe(true)
    })
})

describe('verify maxNumberOfItemsPerAxis', () => {
    const rule_prop = RULE_PROP_MAX_ITEMS_PER_AXIS

    it('key should be valid axis id', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[rule_prop] ||
                    allArrayItemsAreValidAxisIds(Object.keys(rule[rule_prop]))
            )
        ).toBe(true)
    })

    it('value should not be 0', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[rule_prop] || noObjectValuesAreZero(rule[rule_prop])
            )
        ).toBe(true)
    })

    it('value should not be negative', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[rule_prop] ||
                    noObjectValuesAreNegative(rule[rule_prop])
            )
        ).toBe(true)
    })
})

//TODO: Implement tests for minNumberOfDimsPerAxis if this prop will not be removed in the future

describe('verify availableAxes', () => {
    const rule_prop = RULE_PROP_AVAILABLE_AXES

    it('is array', () => {
        expect(
            testResourceRules.every(
                rule => !rule[rule_prop] || Array.isArray(rule[rule_prop])
            )
        ).toBe(true)
    })

    it('items should be valid axis ids', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[rule_prop] ||
                    allArrayItemsAreValidAxisIds(rule[rule_prop])
            )
        ).toBe(true)
    })

    it('should not be empty', () => {
        expect(
            testResourceRules.every(
                rule => !rule[rule_prop] || rule[rule_prop].length > 0
            )
        ).toBe(true)
    })
})

describe('verify lockedDims', () => {
    const rule_prop = RULE_PROP_LOCKED_DIMS

    it('key should be valid lockable dimension', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[rule_prop] ||
                    allArrayItemsAreValid(
                        Object.keys(rule[rule_prop]),
                        lockableDims
                    )
            )
        ).toBe(true)
    })

    it('value should be valid axis id', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[rule_prop] ||
                    allArrayItemsAreValidAxisIds(Object.values(rule[rule_prop]))
            )
        ).toBe(true)
    })
})

describe('verify disallowedDims', () => {
    const rule_prop = RULE_PROP_DISALLOWED_DIMS
    it('is array', () => {
        expect(
            testResourceRules.every(
                rule => !rule[rule_prop] || Array.isArray(rule[rule_prop])
            )
        ).toBe(true)
    })

    it('items should be valid axis ids', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[rule_prop] ||
                    allArrayItemsAreValid(rule[rule_prop], disallowableDims)
            )
        ).toBe(true)
    })
})
