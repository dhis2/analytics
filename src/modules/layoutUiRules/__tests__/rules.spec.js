import {
    testResourceRules,
    testResourceRequiredProps,
    testResourceAllRuleProps,
} from '../rules'
import { ALL_AXIS_IDS } from '../../layout/axis'
import { DIMENSION_ID_DATA, DIMENSION_ID_PERIOD } from '../../fixedDimensions'

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

const hasKeysAndValues = object =>
    Object.keys(object).length && Object.values(object).length

describe('verify all rules', () => {
    it('(testResourceRules) is array', () => {
        expect(Array.isArray(testResourceRules)).toBe(true)
    })

    it('implements all required props', () => {
        expect(
            testResourceRules.every(rule =>
                testResourceRequiredProps.every(
                    val => Object.keys(rule).indexOf(val) !== -1
                )
            )
        ).toBe(true)
    })

    it('only implements allowed rule props', () => {
        expect(
            testResourceRules.every(rule =>
                allArrayItemsAreValid(
                    Object.keys(rule),
                    Object.values(testResourceAllRuleProps)
                )
            )
        ).toBe(true)
    })
})

describe("verify each rule's maxNumberOfDimsPerAxis", () => {
    const rule_prop = testResourceAllRuleProps['MAX_DIMS_PER_AXIS']

    it('has keys and values', () => {
        expect(
            testResourceRules.every(
                rule => !rule[rule_prop] || hasKeysAndValues(rule[rule_prop])
            )
        ).toBe(true)
    })

    it('keys should be valid axis ids', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[rule_prop] ||
                    allArrayItemsAreValidAxisIds(Object.keys(rule[rule_prop]))
            )
        ).toBe(true)
    })

    it('values should not be 0', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[rule_prop] || noObjectValuesAreZero(rule[rule_prop])
            )
        ).toBe(true)
    })

    it('values should not be negative', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[rule_prop] ||
                    noObjectValuesAreNegative(rule[rule_prop])
            )
        ).toBe(true)
    })
})

describe("verify each rule's maxNumberOfItemsPerAxis", () => {
    const rule_prop = testResourceAllRuleProps['MAX_ITEMS_PER_AXIS']

    it('has keys and values', () => {
        expect(
            testResourceRules.every(
                rule => !rule[rule_prop] || hasKeysAndValues(rule[rule_prop])
            )
        ).toBe(true)
    })

    it('keys should be valid axis ids', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[rule_prop] ||
                    allArrayItemsAreValidAxisIds(Object.keys(rule[rule_prop]))
            )
        ).toBe(true)
    })

    it('values should not be 0', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[rule_prop] || noObjectValuesAreZero(rule[rule_prop])
            )
        ).toBe(true)
    })

    it('values should not be negative', () => {
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

describe("verify each rule's availableAxes", () => {
    const rule_prop = testResourceAllRuleProps['AVAILABLE_AXES']

    it('values are arrays', () => {
        expect(
            testResourceRules.every(
                rule => !rule[rule_prop] || Array.isArray(rule[rule_prop])
            )
        ).toBe(true)
    })

    it('array items should be valid axis ids', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[rule_prop] ||
                    allArrayItemsAreValidAxisIds(rule[rule_prop])
            )
        ).toBe(true)
    })

    it('array should not be empty', () => {
        expect(
            testResourceRules.every(
                rule => !rule[rule_prop] || rule[rule_prop].length > 0
            )
        ).toBe(true)
    })
})

describe("verify each rule's lockedDims", () => {
    const rule_prop = testResourceAllRuleProps['LOCKED_DIMS']

    it('has keys and values', () => {
        expect(
            testResourceRules.every(
                rule => !rule[rule_prop] || hasKeysAndValues(rule[rule_prop])
            )
        ).toBe(true)
    })

    it('keys should be valid lockable dimensions', () => {
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

    it('values should be valid axis id', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[rule_prop] ||
                    allArrayItemsAreValidAxisIds(Object.values(rule[rule_prop]))
            )
        ).toBe(true)
    })
})

describe("verify each rule's disallowedDims", () => {
    const rule_prop = testResourceAllRuleProps['DISALLOWED_DIMS']
    it('is an array', () => {
        expect(
            testResourceRules.every(
                rule => !rule[rule_prop] || Array.isArray(rule[rule_prop])
            )
        ).toBe(true)
    })

    it('array items are valid axis ids', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[rule_prop] ||
                    allArrayItemsAreValid(rule[rule_prop], disallowableDims)
            )
        ).toBe(true)
    })
})
