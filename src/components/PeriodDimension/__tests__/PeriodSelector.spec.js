import { shallow } from 'enzyme'
import React from 'react'
import PeriodTransfer from '../PeriodTransfer.js'

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
