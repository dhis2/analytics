import React from 'react'
import { shallow } from 'enzyme'
import PeriodTransfer from '../PeriodTransfer'

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
        }
        shallowPeriodTransfer = undefined
    })

    it('matches the snapshot', () => {
        const wrapper = getWrapper()

        expect(wrapper).toMatchSnapshot()
    })
})
