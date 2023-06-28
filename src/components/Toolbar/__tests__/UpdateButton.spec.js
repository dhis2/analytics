import { shallow } from 'enzyme'
import React from 'react'
import { UpdateButton } from '../index.js'

describe('<UpdateButton/>', () => {
    const noop = () => {}

    it('accepts an `onClick` prop', () => {
        const onClick = jest.fn()
        const wrapper = shallow(<UpdateButton onClick={onClick} />)

        wrapper.simulate('click')

        expect(onClick).toHaveBeenCalledTimes(1)
    })
    it('accepts a `dataTest` prop', () => {
        const dataTest = 'test'
        const wrapper = shallow(
            <UpdateButton onClick={noop} dataTest={dataTest} />
        )

        expect(wrapper.prop('data-test')).toBe(dataTest)
    })
    it('accepts a `disabled` prop', () => {
        const wrapper = shallow(<UpdateButton disabled onClick={noop} />)

        expect(wrapper.find('button').prop('disabled')).toEqual(true)
    })
    it('accepts an `loading` prop', () => {
        const wrapper = shallow(<UpdateButton onClick={noop} loading />)

        expect(wrapper.find('CircularLoader')).toHaveLength(1)
    })
})
