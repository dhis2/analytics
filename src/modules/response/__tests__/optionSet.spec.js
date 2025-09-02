import responseHideNa from '../../../__demo__/data/event/optionset.data.hidena.json'
import responseOrg from '../../../__demo__/data/event/optionset.data.org.json'
import {
    getOptionCodeIdMap,
    getOptionIdRows,
    applyOptionSetHandler,
} from '../optionSet.js'

const testOptionCodeIdMap1 = {
    ONE: 'optionId1',
    TWO: 'optionId2',
}

const testOptionCodeIdMap2 = {
    ONE: 'optionId3',
    TWO: 'optionId4',
}

describe('optionSet', () => {
    describe('getOptionCodeIdMap', () => {
        it('should create an option code:id object', () => {
            const testId = responseHideNa.headers[0].name
            const testOptionIds = responseHideNa.metaData.dimensions[testId]
            const testOptionItems = responseHideNa.metaData.items

            expect(getOptionCodeIdMap(testOptionIds, testOptionItems)).toEqual(
                testOptionCodeIdMap1
            )
        })
    })

    // Test the solution for two option sets with shared option codes
    describe('getOptionIdRows', () => {
        it('should replace option codes with ids in the right index', () => {
            const optionSet1Rows = getOptionIdRows(
                responseOrg.rows,
                testOptionCodeIdMap1,
                0
            )

            const optionSet1And2Rows = getOptionIdRows(
                optionSet1Rows,
                testOptionCodeIdMap2,
                1
            )

            expect(optionSet1And2Rows).toEqual(responseHideNa.rows)
        })
    })

    describe('applyOptionSetHandler', () => {
        it('should return the transformed response', () => {
            const optionSet1Response = applyOptionSetHandler(responseOrg, 0)
            const optionSet1And2Response = applyOptionSetHandler(
                optionSet1Response,
                1
            )

            expect(optionSet1And2Response).toEqual(responseHideNa)
        })
    })
})
