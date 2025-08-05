import response from '../../../__demo__/data/event/boolean.data.json'
import responseOrg from '../../../__demo__/data/event/boolean.data.org.json'
import { applyBooleanHandler } from '../boolean.js'

const headerIndex = 0

describe('boolean', () => {
    describe('applyBooleanHandler', () => {
        it('should return the transformed response', () => {
            expect(applyBooleanHandler(responseOrg, headerIndex)).toEqual(
                response
            )
        })
    })
})
