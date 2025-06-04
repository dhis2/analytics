import { shallow } from 'enzyme'
import React from 'react'
import { Toolbar } from '../index.js'

describe('<Toolbar/>', () => {
    it('renders children', () => {
        const childNode = 'text node'
        const wrapper = shallow(<Toolbar>{childNode}</Toolbar>)

        expect(wrapper.containsMatchingElement(childNode)).toBe(true)
    })
    it('accepts a `dataTest` prop', () => {
        const dataTest = 'test'
        const wrapper = shallow(<Toolbar dataTest={dataTest} />)

        expect(wrapper.prop('data-test')).toBe(dataTest)
    })
})
