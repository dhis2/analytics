import booleanResponseHideNa from '../../../__demo__/data/event/boolean.data.hidena.json'
import booleanResponseOrg from '../../../__demo__/data/event/boolean.data.org.json'
import yesOnlyResponseHideNa from '../../../__demo__/data/event/yesonly.data.hidena.json'
import yesOnlyResponseOrg from '../../../__demo__/data/event/yesonly.data.org.json'
import { applyBooleanHandler } from '../boolean.js'

const headerIndex = 0

describe('boolean', () => {
    describe('applyBooleanHandler', () => {
        describe('yes/no', () => {
            it('should return the transformed response', () => {
                expect(
                    applyBooleanHandler(booleanResponseOrg, headerIndex)
                ).toEqual(booleanResponseHideNa)
            })
        })

        describe('yes only', () => {
            it('should return the transformed response', () => {
                expect(
                    applyBooleanHandler(yesOnlyResponseOrg, headerIndex)
                ).toEqual(yesOnlyResponseHideNa)
            })
        })
    })
})
