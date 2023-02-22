import { shallow } from 'enzyme'
import React from 'react'
import PeriodTransfer from '../PeriodTransfer.js'

jest.mock('@dhis2/app-runtime', () => ({
    useConfig: () => ({ systemInfo: {} }),
    useDataQuery: () => ({ data: { userSettings: { keyUiLocale: 'en' } } }),
}))

afterEach(jest.clearAllMocks)

describe('The Period Selector component', () => {
    let props
    let shallowPeriodTransfer

    const getWrapper = () => {
        if (!shallowPeriodTransfer) {
            shallowPeriodTransfer = shallow(<PeriodTransfer {...props} />)
        }
        return shallowPeriodTransfer
    }

    beforeEach(() => {
        props = {
            initialSelectedPeriods: [],
            onSelect: jest.fn(),
            rightFooter: <></>,
            dataTest: 'period-dimension',
        }
        shallowPeriodTransfer = undefined
    })

    it('matches the snapshot', () => {
        const wrapper = getWrapper()

        expect(wrapper).toMatchSnapshot()
    })
})
