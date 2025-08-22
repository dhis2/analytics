import responseHideNa from '../../../__demo__/data/event/optionset.data.hidena.json'
import responseOrg from '../../../__demo__/data/event/optionset.data.org.json'
import {
    getOptionCodeIdMap,
    getOptionIdRows,
    applyOptionSetHandler,
} from '../optionSet.js'

const headerIndex = 0
const testId = responseHideNa.headers[headerIndex].name

const testOptionCodeIdMap = {
    MODABSC: 'Fhbf4aKpZmZ',
    MODDIED: 'gj2fKKyp8OH',
    MODTRANS: 'fShHdgT7XGb',
    MODDISCH: 'yeod5tOXpkP',
}

describe('optionSet', () => {
    describe('getOptionCodeIdMap', () => {
        it('should create an option code:id object', () => {
            const testOptionIds = responseHideNa.metaData.dimensions[testId]
            const testOptionItems = responseHideNa.metaData.items

            expect(getOptionCodeIdMap(testOptionIds, testOptionItems)).toEqual(
                testOptionCodeIdMap
            )
        })
    })

    describe('getOptionIdRows', () => {
        it('should replace option codes with ids in the right index', () => {
            expect(
                getOptionIdRows(
                    responseOrg.rows,
                    testOptionCodeIdMap,
                    headerIndex
                )
            ).toEqual(responseHideNa.rows)
        })
    })

    describe('applyOptionSetHandler', () => {
        it('should return the transformed response', () => {
            expect(applyOptionSetHandler(responseOrg, headerIndex)).toEqual(
                responseHideNa
            )
        })
    })
})
