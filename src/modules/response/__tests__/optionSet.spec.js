import response from '../../../__demo__/data/event/optionset.data.json'
import responseOrg from '../../../__demo__/data/event/optionset.data.org.json'
import { getOptionCodeIdMap, getOptionIdRows, applyOptionSetHandler } from "../optionSet.js"

const modeOfDischargeId = 'Zj7UnCAulEk.fWIAEtYVEGk'
const headerIndex = 0

const testOptionCodeIdMap = {
    "MODABSC": "Fhbf4aKpZmZ",
    "MODDIED": "gj2fKKyp8OH",
    "MODTRANS": "fShHdgT7XGb",
    "MODDISCH": "yeod5tOXpkP",
}

describe('optionSet', () => {
    describe('getOptionCodeIdMap', () => {
        it('should create an option code:id object', () => {
            const testOptionIds = response.metaData.dimensions[modeOfDischargeId]
            const testOptionItems = response.metaData.items

            expect(getOptionCodeIdMap(testOptionIds, testOptionItems)).toEqual(testOptionCodeIdMap)
        })
    })

    describe('getOptionIdRows', () => {
        it('should replace option codes with ids in the right index', () => {
            expect(getOptionIdRows(responseOrg.rows, testOptionCodeIdMap, headerIndex)).toEqual(response.rows)
        })
    })

    describe('applyOptionSetHandler', () => {
        it('should return the transformed response', () => {
            expect(applyOptionSetHandler(responseOrg, headerIndex)).toEqual(response)
        })
    })
})