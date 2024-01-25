import { shallow } from 'enzyme'
import React from 'react'
import { HoverMenuDropdown } from '../index.js'

describe('<HoverMenuDropdown/>', () => {
    /* Most of the props for this component are included
     * in the mouse interaction tests for the HoverMenuBar.
     * Only the `dataTest` prop needs to be verified here. */

    it('accepts a `dataTest` prop', () => {
        const dataTest = 'test'
        const wrapper = shallow(
            <HoverMenuDropdown label="test dropdown" dataTest={dataTest}>
                children
            </HoverMenuDropdown>
        )

        expect(wrapper.find('button').prop('data-test')).toBe(dataTest)
    })

    it('accepts a `className` prop', () => {
        const className = 'test'
        const wrapper = shallow(
            <HoverMenuDropdown label="test dropdown" className={className}>
                children
            </HoverMenuDropdown>
        )

        expect(wrapper.find('button')).toHaveClassName(className)
    })
})
