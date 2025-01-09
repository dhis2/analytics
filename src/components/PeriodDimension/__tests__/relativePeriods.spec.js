import {
    getRelativePeriodsDetails,
    getRelativePeriodsName,
} from '../utils/relativePeriods.js'

describe('relativePeriods utils', () => {
    it('should correctly return relative periods details', () => {
        const details = getRelativePeriodsDetails()
        expect(details).toMatchSnapshot()
    })

    it('should correctly return relative periods names', () => {
        const names = getRelativePeriodsName()
        expect(names).toMatchSnapshot()
    })
})
