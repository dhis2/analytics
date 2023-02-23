import { shallow } from 'enzyme'
import React from 'react'
import PeriodDimension from '../PeriodDimension.js'

jest.mock('@dhis2/app-runtime', () => ({
    useConfig: () => ({ systemInfo: {} }),
    useDataQuery: () => ({ data: { userSettings: { keyUiLocale: 'en' } } }),
}))

afterEach(jest.clearAllMocks)

describe('The Period Dimension component', () => {
    let props
    let shallowPeriodDimension

    const getWrapper = () => {
        if (!shallowPeriodDimension) {
            shallowPeriodDimension = shallow(<PeriodDimension {...props} />)
        }
        return shallowPeriodDimension
    }

    beforeEach(() => {
        props = {
            selectedPeriods: [],
            onSelect: jest.fn(),
            rightFooter: <></>,
        }
        shallowPeriodDimension = undefined
    })

    it('matches the snapshot', () => {
        const wrapper = getWrapper()

        expect(wrapper).toMatchSnapshot()
    })
})
