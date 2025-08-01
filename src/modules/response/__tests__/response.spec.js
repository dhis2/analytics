import responseBoolean from '../../../__demo__/data/event/boolean.data.json'
import responseBooleanOrg from '../../../__demo__/data/event/boolean.data.org.json'
import responseNumeric from '../../../__demo__/data/event/numeric.data.json'
import responseNumericOrg from '../../../__demo__/data/event/numeric.data.org.json'
import responseOptionSet from '../../../__demo__/data/event/optionset.data.json'
import responseOptionSetOrg from '../../../__demo__/data/event/optionset.data.org.json'
import responseYesOnly from '../../../__demo__/data/event/yesonly.data.json'
import responseYesOnlyOrg from '../../../__demo__/data/event/yesonly.data.org.json'
import { transformResponse } from '../response.js'

describe('response', () => {
    describe('transformResponse', () => {
        it('transforms boolean response', () => {
            expect(transformResponse(responseBooleanOrg)).toEqual(
                responseBoolean
            )
        })

        it('transforms yes only response', () => {
            expect(transformResponse(responseYesOnlyOrg)).toEqual(
                responseYesOnly
            )
        })

        it('transforms option set response', () => {
            expect(transformResponse(responseOptionSetOrg)).toEqual(
                responseOptionSet
            )
        })

        it('transforms numeric response', () => {
            expect(transformResponse(responseNumericOrg)).toEqual(
                responseNumeric
            )
        })
    })
})
