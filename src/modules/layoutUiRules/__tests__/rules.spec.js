import { testResourceRules, testResourceRequiredProps } from '../rules'
import { ALL_AXIS_IDS } from '../../layout/axis'

describe('verify required rule props', () => {
    it('should return true', () => {
        expect(
            testResourceRules.every(rule =>
                testResourceRequiredProps.every(prop =>
                    prop.isValid(rule[prop.name])
                )
            )
        ).toBe(true)
    })

    it('should return false (mocked rules)', () => {
        const mockRules = [{}]

        expect(
            mockRules.every(rule =>
                testResourceRequiredProps.every(prop =>
                    prop.isValid(rule[prop.name])
                )
            )
        ).toBe(false)
    })

    it('should return false (mocked required props)', () => {
        const mockRequiredProps = [
            {
                name: 'notRealRequiredProp',
                isValid: prop => prop !== undefined,
            },
        ]

        expect(
            testResourceRules.every(rule =>
                mockRequiredProps.every(prop => prop.isValid(rule[prop.name]))
            )
        ).toBe(false)
    })
})

describe('verify maxNumberOfDimsPerAxis', () => {
    it('key should be valid axis id', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule.maxNumberOfDimsPerAxis ||
                    Object.keys(rule.maxNumberOfDimsPerAxis).every(value =>
                        ALL_AXIS_IDS.includes(value)
                    )
            )
        ).toBe(true)
    })

    it('value should not be 0', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule.maxNumberOfDimsPerAxis ||
                    Object.values(rule.maxNumberOfDimsPerAxis).every(
                        value => value !== 0
                    )
            )
        ).toBe(true)
    })

    it('value should not be negative', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule.maxNumberOfDimsPerAxis ||
                    Object.values(rule.maxNumberOfDimsPerAxis).every(
                        value => value > 0
                    )
            )
        ).toBe(true)
    })
})

describe('verify maxNumberOfItemsPerAxis value', () => {
    it('key should be valid axis id', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule.maxNumberOfItemsPerAxis ||
                    Object.keys(rule.maxNumberOfItemsPerAxis).every(value =>
                        ALL_AXIS_IDS.includes(value)
                    )
            )
        ).toBe(true)
    })

    it('should not be 0', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule.maxNumberOfItemsPerAxis ||
                    Object.values(rule.maxNumberOfItemsPerAxis).every(
                        value => value !== 0
                    )
            )
        ).toBe(true)
    })

    it('should not be negative', () => {
        expect(
            testResourceRules.every(
                rule =>
                    !rule.maxNumberOfItemsPerAxis ||
                    Object.values(rule.maxNumberOfItemsPerAxis).every(
                        value => value > 0
                    )
            )
        ).toBe(true)
    })
})
