import { shallow } from 'enzyme'
import React from 'react'
import { HoverMenuListItem } from '../index.js'

describe('<HoverMenuListItem/>', () => {
    /* Some of the props for this component are included
     * in the mouse interaction tests for the HoverMenuBar.
     * Only the `className`, `dataTest`, `destructive` and
     * `icon` prop need to be verified here. */

    it('accepts a `className` prop', () => {
        const className = 'className'
        const wrapper = shallow(<HoverMenuListItem className={className} />)

        expect(wrapper.find('li')).toHaveClassName(className)
    })

    it('accepts a `dataTest` prop', () => {
        const dataTest = 'test'
        const wrapper = shallow(<HoverMenuListItem dataTest={dataTest} />)

        expect(wrapper.find('li').prop('data-test')).toBe(dataTest)
    })

    it('accepts a `destructive` prop', () => {
        const wrapper = shallow(<HoverMenuListItem destructive />)

        expect(wrapper.find('li')).toHaveClassName('destructive')
    })
    it('accepts an `icon` prop', () => {
        const iconText = 'I am an icon'
        const icon = <span id="testicon">{iconText}</span>
        const wrapper = shallow(<HoverMenuListItem icon={icon} />)

        expect(wrapper.find('span.icon')).toExist()
        expect(wrapper.find('span#testicon')).toExist()
        expect(wrapper.find('span#testicon').text()).toBe(iconText)
    })
})
