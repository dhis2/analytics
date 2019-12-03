import {
    testResourceRules,
    testResourceRequiredProps,
    RULE_PROP_AVAILABLE_AXES,
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
    it('key should be valid axis id', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule.maxNumberOfDimsPerAxis ||
                    allArrayItemsAreValidAxisIds(
                        Object.keys(rule.maxNumberOfDimsPerAxis)
                    )
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
                    allArrayItemsAreValidAxisIds(
                        Object.keys(rule.maxNumberOfItemsPerAxis)
                    )
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
    it('is array', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[RULE_PROP_AVAILABLE_AXES] ||
                    Array.isArray(rule[RULE_PROP_AVAILABLE_AXES])
            )
        ).toBe(true)
    })

    it('items should be valid axis ids', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[RULE_PROP_AVAILABLE_AXES] ||
                    allArrayItemsAreValidAxisIds(rule[RULE_PROP_AVAILABLE_AXES])
            )
        ).toBe(true)
    })

    it('should not be empty', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[RULE_PROP_AVAILABLE_AXES] ||
                    rule[RULE_PROP_AVAILABLE_AXES].length > 0
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
                    allArrayItemsAreValid(
                        Object.keys(rule.lockedDims),
                        lockableDims
                    )
            )
        ).toBe(true)
    })

    it('value should be valid axis id', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule.lockedDims ||
                    allArrayItemsAreValidAxisIds(Object.values(rule.lockedDims))
            )
        ).toBe(true)
    })
})

describe('verify disallowedDims', () => {
    it('is array', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule.disallowedDims || Array.isArray(rule.disallowedDims)
            )
        ).toBe(true)
    })

    it('items should be valid axis ids', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule.disallowedDims ||
                    allArrayItemsAreValid(rule.disallowedDims, disallowableDims)
            )
        ).toBe(true)
    })
})
