import { shallow, mount } from 'enzyme'
import React from 'react'
import { HoverMenuList, HoverMenuListItem } from '../index.js'

describe('<HoverMenuList/>', () => {
    const dataTest = 'test'
    const childNode = 'children'

    it('renders children', () => {
        const wrapper = shallow(<HoverMenuList>{childNode}</HoverMenuList>)
        expect(wrapper.containsMatchingElement(childNode)).toBe(true)
    })
    it('accept a `className` prop', () => {
        const className = 'className'
        const wrapper = shallow(
            <HoverMenuList className={className}>{childNode}</HoverMenuList>
        )
        expect(wrapper.find('ul')).toHaveClassName(className)
    })

    it('accepts a `dataTest` prop', () => {
        const wrapper = shallow(
            <HoverMenuList dataTest={dataTest}>{childNode}</HoverMenuList>
        )

        expect(wrapper.find('ul').prop('data-test')).toBe(dataTest)
    })

    it('accept a `dense` prop', () => {
        const wrapper = mount(
            <HoverMenuList dense>
                <HoverMenuListItem label="item 1" />
                <HoverMenuListItem label="item 2" />
            </HoverMenuList>
        )

        expect(wrapper.find('li').first()).toHaveClassName('dense')
        expect(wrapper.find('li').last()).toHaveClassName('dense')
    })
    it('accept a `maxHeight` prop', () => {
        const maxHeight = '100000px'
        const wrapper = shallow(
            <HoverMenuList maxHeight={maxHeight}>{childNode}</HoverMenuList>
        )
        expect(wrapper.find('style').text()).toContain(
            `max-height: ${maxHeight}`
        )
    })
    it('accept a `maxWidth` prop', () => {
        const maxWidth = '100000px'
        const wrapper = shallow(
            <HoverMenuList maxWidth={maxWidth}>{childNode}</HoverMenuList>
        )
        expect(wrapper.find('style').text()).toContain(`max-width: ${maxWidth}`)
    })
})
