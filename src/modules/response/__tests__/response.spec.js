import responseBooleanHideNa from '../../../__demo__/data/event/boolean.data.hidena.json'
import responseBoolean from '../../../__demo__/data/event/boolean.data.json'
import responseBooleanOrg from '../../../__demo__/data/event/boolean.data.org.json'
import responseNumericHideNa from '../../../__demo__/data/event/numeric.data.hidena.json'
import responseNumeric from '../../../__demo__/data/event/numeric.data.json'
import responseNumericOrg from '../../../__demo__/data/event/numeric.data.org.json'
import responseOptionSetHideNa from '../../../__demo__/data/event/optionset.data.hidena.json'
import responseOptionSet from '../../../__demo__/data/event/optionset.data.json'
import responseOptionSetOrg from '../../../__demo__/data/event/optionset.data.org.json'
import responseOptionSetsHideNa from '../../../__demo__/data/event/optionsets.data.hidena.json'
import responseOptionSets from '../../../__demo__/data/event/optionsets.data.json'
import responseOptionSetsOrg from '../../../__demo__/data/event/optionsets.data.org.json'
import responseYesOnlyHideNa from '../../../__demo__/data/event/yesonly.data.hidena.json'
import responseYesOnly from '../../../__demo__/data/event/yesonly.data.json'
import responseYesOnlyOrg from '../../../__demo__/data/event/yesonly.data.org.json'
import { transformResponse } from '../response.js'

describe('response', () => {
    describe('transformResponse', () => {
        describe('numeric', () => {
            it('transforms response', () => {
                expect(transformResponse(responseNumericOrg)).toEqual(
                    responseNumeric
                )
            })

            it('transforms response and hides N/A data', () => {
                expect(
                    transformResponse(responseNumericOrg, { hideNaData: true })
                ).toEqual(responseNumericHideNa)
            })
        })

        describe('option set', () => {
            it('transforms response', () => {
                expect(transformResponse(responseOptionSetOrg)).toEqual(
                    responseOptionSet
                )
            })

            it('transforms response and hides N/A data', () => {
                expect(
                    transformResponse(responseOptionSetOrg, {
                        hideNaData: true,
                    })
                ).toEqual(responseOptionSetHideNa)
            })

            it('transforms response with non-unique codes across two option sets', () => {
                expect(transformResponse(responseOptionSetsOrg)).toEqual(
                    responseOptionSets
                )
            })

            it('transforms response with non-unique codes across two option sets and hides N/A data', () => {
                expect(
                    transformResponse(responseOptionSetsOrg, {
                        hideNaData: true,
                    })
                ).toEqual(responseOptionSetsHideNa)
            })
        })

        describe('boolean', () => {
            it('transforms response', () => {
                expect(transformResponse(responseBooleanOrg)).toEqual(
                    responseBoolean
                )
            })

            it('transforms response and hides N/A data', () => {
                expect(
                    transformResponse(responseBooleanOrg, {
                        hideNaData: true,
                    })
                ).toEqual(responseBooleanHideNa)
            })
        })

        describe('yes only', () => {
            it('transforms response', () => {
                expect(transformResponse(responseYesOnlyOrg)).toEqual(
                    responseYesOnly
                )
            })

            it('transforms response and hides N/A data', () => {
                expect(
                    transformResponse(responseYesOnlyOrg, {
                        hideNaData: true,
                    })
                ).toEqual(responseYesOnlyHideNa)
            })
        })
    })
})
