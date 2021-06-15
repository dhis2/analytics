import { shallow } from 'enzyme'
import React from 'react'
import FixedPeriodSelect from '../FixedPeriodSelect.js'

describe('The Fixed Period Single Select component', () => {
    let props
    let shallowFixedPeriodSelect

    const getWrapper = () => {
        if (!shallowFixedPeriodSelect) {
            shallowFixedPeriodSelect = shallow(<FixedPeriodSelect {...props} />)
        }
        return shallowFixedPeriodSelect
    }

    beforeEach(() => {
        props = {
            value: '201405',
            onChange: () => {},
        }
        shallowFixedPeriodSelect = undefined
    })

    it('matches the snapshot', () => {
        const wrapper = getWrapper()

        expect(wrapper).toMatchSnapshot()
    })
})
	