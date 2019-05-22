import { getLevelsFromIds } from '../orgUnitDimensions'

const levelOptions = [{ id: 'fluttershy' }, { id: 'rarity' }]

describe('orgUnitDimension module', () => {
    it('returns array with id when level-id received', () => {
        expect(getLevelsFromIds(['abc', 'LEVEL-rarity'], levelOptions)).toEqual(
            ['rarity']
        )
    })

    it('returns empty array when level-id not received', () => {
        expect(getLevelsFromIds(['abc', 'rarity'], levelOptions)).toEqual([])
    })
})
