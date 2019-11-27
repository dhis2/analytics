import { testResourceRequiredProps } from '../rules'
import { testResourceRules } from '../rulesHelper'

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
