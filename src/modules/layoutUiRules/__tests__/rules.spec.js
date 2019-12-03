import {
    testResourceRules,
    testResourceRequiredProps,
    testResourceAllRuleProps,
} from '../rules'
import { ALL_AXIS_IDS } from '../../layout/axis'
import { DIMENSION_ID_DATA, DIMENSION_ID_PERIOD } from '../../fixedDimensions'

// Consts
const lockableDims = [DIMENSION_ID_DATA, DIMENSION_ID_PERIOD]
const disallowableDims = [DIMENSION_ID_DATA, DIMENSION_ID_PERIOD]

// Helper fns
const allArrayItemsAreValid = (allItems, validItems) =>
    allItems.every(value => validItems.includes(value))

const allArrayItemsAreValidAxisIds = array =>
    allArrayItemsAreValid(array, ALL_AXIS_IDS)

// Partial tests
const testPropHasKeysAndValues = ruleProp =>
    it('has keys and values', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[ruleProp] ||
                    (Object.keys(rule[ruleProp]).length &&
                        Object.values(rule[ruleProp]).length)
            )
        ).toBe(true)
    })

const testPropIsArray = ruleProp =>
    it('is an array', () => {
        expect(
            testResourceRules.every(
                rule => !rule[ruleProp] || Array.isArray(rule[ruleProp])
            )
        ).toBe(true)
    })

const testKeysAreValidAxisIds = ruleProp =>
    it('keys should be valid axis ids', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[ruleProp] ||
                    allArrayItemsAreValidAxisIds(Object.keys(rule[ruleProp]))
            )
        ).toBe(true)
    })

const testNoValuesZero = ruleProp =>
    it('values should not be 0', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[ruleProp] ||
                    Object.values(rule[ruleProp]).every(value => value !== 0)
            )
        ).toBe(true)
    })

const testNoValuesNegative = ruleProp =>
    it('values should not be negative', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[ruleProp] ||
                    Object.values(rule[ruleProp]).every(value => value >= 0)
            )
        ).toBe(true)
    })

// Test implementations
describe('verify test resource', () => {
    it('testResourceRules is array', () => {
        expect(Array.isArray(testResourceRules)).toBe(true)
    })

    it('testResourceRequiredProps is array', () => {
        expect(Array.isArray(testResourceRequiredProps)).toBe(true)
    })
})

describe('verify all rules', () => {
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
    const ruleProp = testResourceAllRuleProps['MAX_DIMS_PER_AXIS']

    testPropHasKeysAndValues(ruleProp)
    testKeysAreValidAxisIds(ruleProp)
    testNoValuesZero(ruleProp)
    testNoValuesNegative(ruleProp)
})

describe("verify each rule's maxNumberOfItemsPerAxis", () => {
    const ruleProp = testResourceAllRuleProps['MAX_ITEMS_PER_AXIS']

    testPropHasKeysAndValues(ruleProp)
    testKeysAreValidAxisIds(ruleProp)
    testNoValuesZero(ruleProp)
    testNoValuesNegative(ruleProp)
})

//TODO: Implement tests for minNumberOfDimsPerAxis if this prop will not be removed in the future

describe("verify each rule's availableAxes", () => {
    const ruleProp = testResourceAllRuleProps['AVAILABLE_AXES']

    testPropIsArray(ruleProp)

    it('array items should be valid axis ids', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[ruleProp] ||
                    allArrayItemsAreValidAxisIds(rule[ruleProp])
            )
        ).toBe(true)
    })

    it('array should not be empty', () => {
        expect(
            testResourceRules.every(
                rule => !rule[ruleProp] || rule[ruleProp].length > 0
            )
        ).toBe(true)
    })
})

describe("verify each rule's lockedDims", () => {
    const ruleProp = testResourceAllRuleProps['LOCKED_DIMS']

    testPropHasKeysAndValues(ruleProp)

    it('keys should be valid lockable dimensions', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[ruleProp] ||
                    allArrayItemsAreValid(
                        Object.keys(rule[ruleProp]),
                        lockableDims
                    )
            )
        ).toBe(true)
    })

    it('values should be valid axis id', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[ruleProp] ||
                    allArrayItemsAreValidAxisIds(Object.values(rule[ruleProp]))
            )
        ).toBe(true)
    })
})

describe("verify each rule's disallowedDims", () => {
    const ruleProp = testResourceAllRuleProps['DISALLOWED_DIMS']

    testPropIsArray(ruleProp)

    it('array items should be valid disallowable dims', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule[ruleProp] ||
                    allArrayItemsAreValid(rule[ruleProp], disallowableDims)
            )
        ).toBe(true)
    })
})
