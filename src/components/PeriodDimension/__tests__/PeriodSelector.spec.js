import React from 'react'
import { shallow } from 'enzyme'
import PeriodSelector from '../PeriodSelector'

describe('The Period Selector component', () => {
    let props
    let shallowPeriodSelector

    const getWrapper = () => {
        if (!shallowPeriodSelector) {
            shallowPeriodSelector = shallow(<PeriodSelector {...props} />)
        }
        return shallowPeriodSelector
    }

    beforeEach(() => {
        props = {
            initialSelectedPeriods: [],
            onSelect: jest.fn(),
            rightFooter: <></>,
        }
        shallowPeriodSelector = undefined
    })

    it('matches the snapshot', () => {
        const wrapper = getWrapper()

        expect(wrapper).toMatchSnapshot()
    })
})
