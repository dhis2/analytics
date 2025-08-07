import responseBoolean from '../../../__demo__/data/event/boolean.data.json'
import responseBooleanOrg from '../../../__demo__/data/event/boolean.data.org.json'
import responseNumeric from '../../../__demo__/data/event/numeric.data.json'
import responseNumericOrg from '../../../__demo__/data/event/numeric.data.org.json'
import responseOptionSet from '../../../__demo__/data/event/optionset.data.json'
import responseOptionSetOrg from '../../../__demo__/data/event/optionset.data.org.json'
import responseOptionSets from '../../../__demo__/data/event/optionsets.data.json'
import responseOptionSetsOrg from '../../../__demo__/data/event/optionsets.data.org.json'
import responseYesOnly from '../../../__demo__/data/event/yesonly.data.json'
import responseYesOnlyOrg from '../../../__demo__/data/event/yesonly.data.org.json'
import { removeNaDimensionItems, transformResponse } from '../response.js'

describe('response', () => {
    describe('removeNaDimensionItems', () => {
        it('removes empty strings from array values', () => {
            const input = { dim1: ['a', '', 'b'], dim2: [''] }
            const expected = { dim1: ['a', 'b'], dim2: [] }
            expect(removeNaDimensionItems(input)).toEqual(expected)
        })

        it('leaves non-array values unchanged', () => {
            const input = { dim1: 'abc', dim2: 123, dim3: null }
            const expected = { dim1: 'abc', dim2: 123, dim3: null }
            expect(removeNaDimensionItems(input)).toEqual(expected)
        })

        it('returns an empty object when given an empty object', () => {
            expect(removeNaDimensionItems({})).toEqual({})
        })
    })

    describe('transformResponse', () => {
        describe('numeric', () => {
            it('transforms response', () => {
                expect(transformResponse(responseNumericOrg)).toEqual(
                    responseNumeric
                )
            })

            it('transforms response and hides N/A', () => {
                expect(
                    transformResponse(responseNumericOrg, {
                        hideNaData: true,
                    }).metaData.dimensions['Zj7UnCAulEk.qrur9Dvnyt5'].includes(
                        ''
                    )
                ).toEqual(false)
            })
        })

        describe('option set', () => {
            it('transforms response', () => {
                expect(
                    transformResponse(responseOptionSetOrg, {
                        hideNaData: false,
                    })
                ).toEqual(responseOptionSet)
            })

            it('transforms response and hides N/A', () => {
                expect(
                    transformResponse(responseOptionSetOrg, {
                        hideNaData: true,
                    }).metaData.dimensions['Zj7UnCAulEk.fWIAEtYVEGk'].includes(
                        ''
                    )
                ).toBe(false)
            })

            it('transforms response with non-unique codes across two option sets', () => {
                expect(transformResponse(responseOptionSetsOrg)).toEqual(
                    responseOptionSets
                )
            })
        })

        describe('boolean', () => {
            it('transforms response', () => {
                expect(transformResponse(responseBooleanOrg)).toEqual(
                    responseBoolean
                )
            })

            it('transforms response and hides N/A', () => {
                expect(
                    transformResponse(responseBooleanOrg, {
                        hideNaData: true,
                    }).metaData.dimensions['A03MvHHogjR.bx6fsa0t90x'].includes(
                        ''
                    )
                ).toBe(false)
            })
        })

        describe('yes only', () => {
            it('transforms response', () => {
                expect(transformResponse(responseYesOnlyOrg)).toEqual(
                    responseYesOnly
                )
            })

            it('transforms response and hides N/A', () => {
                expect(
                    transformResponse(responseYesOnlyOrg, {
                        hideNaData: true,
                    }).metaData.dimensions['jfuXZB3A1ko.hwG20Dyj6RK'].includes(
                        ''
                    )
                ).toBe(false)
            })
        })
    })
})
