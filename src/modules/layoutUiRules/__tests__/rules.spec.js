import {
    testResourceRules,
    testResourceRequiredProps,
    RULE_PROP_AVAILABLE_AXES,
} from '../rules'
import { ALL_AXIS_IDS } from '../../layout/axis'
import { DIMENSION_ID_DATA, DIMENSION_ID_PERIOD } from '../../fixedDimensions'

import isObject from 'lodash/isObject'

const lockableDims = [DIMENSION_ID_DATA, DIMENSION_ID_PERIOD]

const allArrayItemsAreValidAxisIds = array =>
    array.every(value => ALL_AXIS_IDS.includes(value))

const allObjectKeysAreValidAxisIds = object =>
    allArrayItemsAreValidAxisIds(Object.keys(object))

const allObjectValuesAreValidAxisIds = object =>
    allArrayItemsAreValidAxisIds(Object.values(object))

const allObjectKeysAreValidLockableDim = object =>
    Object.keys(object).every(value => lockableDims.includes(value))

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
    it('key should be valid axis id', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule.maxNumberOfDimsPerAxis ||
                    allObjectKeysAreValidAxisIds(rule.maxNumberOfDimsPerAxis)
            )
        ).toBe(true)
    })

    it('value should not be 0', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule.maxNumberOfDimsPerAxis ||
                    noObjectValuesAreZero(rule.maxNumberOfDimsPerAxis)
            )
        ).toBe(true)
    })

    it('value should not be negative', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule.maxNumberOfDimsPerAxis ||
                    noObjectValuesAreNegative(rule.maxNumberOfDimsPerAxis)
            )
        ).toBe(true)
    })
})

describe('verify maxNumberOfItemsPerAxis', () => {
    it('key should be valid axis id', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule.maxNumberOfItemsPerAxis ||
                    allObjectKeysAreValidAxisIds(rule.maxNumberOfItemsPerAxis)
            )
        ).toBe(true)
    })

    it('value should not be 0', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule.maxNumberOfItemsPerAxis ||
                    noObjectValuesAreZero(rule.maxNumberOfItemsPerAxis)
            )
        ).toBe(true)
    })

    it('value should not be negative', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule.maxNumberOfItemsPerAxis ||
                    noObjectValuesAreNegative(rule.maxNumberOfItemsPerAxis)
            )
        ).toBe(true)
    })
})

//TODO: Implement tests for minNumberOfDimsPerAxis if this prop will not be removed in the future

describe('verify RULE_PROP_AVAILABLE_AXES', () => {
    const availableAxesProp = RULE_PROP_AVAILABLE_AXES.name
    it('is array', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[availableAxesProp] ||
                    Array.isArray(rule[availableAxesProp])
            )
        ).toBe(true)
    })

    it('items should be valid axis ids', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[availableAxesProp] ||
                    allArrayItemsAreValidAxisIds(rule[availableAxesProp])
            )
        ).toBe(true)
    })

    it('should not be empty', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[availableAxesProp] ||
                    rule[availableAxesProp].length > 0
            )
        ).toBe(true)
    })
})

describe('verify lockedDims', () => {
    it('key should be valid lockable dimension', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule.lockedDims ||
                    allObjectKeysAreValidLockableDim(rule.lockedDims)
            )
        ).toBe(true)
    })

    it('value should be valid axis id', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule.lockedDims ||
                    allObjectValuesAreValidAxisIds(rule.lockedDims)
            )
        ).toBe(true)
    })
})
