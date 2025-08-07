import booleanResponse from '../../../__demo__/data/event/boolean.data.json'
import booleanResponseOrg from '../../../__demo__/data/event/boolean.data.org.json'
import yesOnlyResponse from '../../../__demo__/data/event/yesonly.data.json'
import yesOnlyResponseOrg from '../../../__demo__/data/event/yesonly.data.org.json'
import { applyBooleanHandler } from '../boolean.js'

const headerIndex = 0

describe('boolean', () => {
    describe('applyBooleanHandler', () => {
        describe('boolean', () => {
            it('should return the transformed response', () => {
                expect(
                    applyBooleanHandler(booleanResponseOrg, headerIndex)
                ).toEqual(booleanResponse)
            })
        })

        describe('yes only', () => {
            it('should return the transformed response', () => {
                expect(
                    applyBooleanHandler(yesOnlyResponseOrg, headerIndex)
                ).toEqual(yesOnlyResponse)
            })
        })
    })
})
