import { shallow } from 'enzyme'
import React from 'react'
import { InterpretationsAndDetailsToggler } from '../index.js'

describe('<InterpretationsAndDetailsToggler/>', () => {
    const noop = () => {}

    it('accepts an `onClick` prop', () => {
        const onClick = jest.fn()
        const wrapper = shallow(
            <InterpretationsAndDetailsToggler onClick={onClick} />
        )

        wrapper.simulate('click')

        expect(onClick).toHaveBeenCalledTimes(1)
    })
    it('accepts a `dataTest` prop', () => {
        const dataTest = 'test'
        const wrapper = shallow(
            <InterpretationsAndDetailsToggler
                onClick={noop}
                dataTest={dataTest}
            />
        )

        expect(wrapper.prop('data-test')).toBe(dataTest)
    })
    it('accepts a `disabled` prop', () => {
        const wrapper = shallow(
            <InterpretationsAndDetailsToggler disabled onClick={noop} />
        )

        expect(wrapper.find('button').prop('disabled')).toEqual(true)
    })
    it('accepts an `isShowing` prop', () => {
        const wrapper = shallow(
            <InterpretationsAndDetailsToggler onClick={noop} />
        )
        const wrapperWithIsShowing = shallow(
            <InterpretationsAndDetailsToggler isShowing onClick={noop} />
        )

        expect(wrapper.find('SvgChevronRight24')).toHaveLength(0)
        expect(wrapper.find('SvgChevronLeft24')).toHaveLength(1)

        expect(wrapperWithIsShowing.find('SvgChevronRight24')).toHaveLength(1)
        expect(wrapperWithIsShowing.find('SvgChevronLeft24')).toHaveLength(0)
    })
})
