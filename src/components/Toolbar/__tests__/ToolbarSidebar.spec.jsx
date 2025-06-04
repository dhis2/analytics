import { shallow } from 'enzyme'
import React from 'react'
import { ToolbarSidebar } from '../index.js'

describe('<ToolbarSidebar/>', () => {
    it('renders children', () => {
        const childNode = 'text node'
        const wrapper = shallow(<ToolbarSidebar>{childNode}</ToolbarSidebar>)

        expect(wrapper.containsMatchingElement(childNode)).toBe(true)
    })
    it('accepts a `dataTest` prop', () => {
        const dataTest = 'test'
        const wrapper = shallow(<ToolbarSidebar dataTest={dataTest} />)

        expect(wrapper.prop('data-test')).toBe(dataTest)
    })
    it('accepts a `isHidden` prop', () => {
        const wrapper = shallow(<ToolbarSidebar isHidden />)

        expect(wrapper.find('div').hasClass('isHidden')).toEqual(true)
    })
})
