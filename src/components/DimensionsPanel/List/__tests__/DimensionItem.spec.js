import React from 'react'
import { DimensionItem } from '../DimensionItem'
import { shallow } from 'enzyme'

describe('DimensionItem', () => {
    let props
    let shallowItem
    const dimensionItem = () => {
        if (!shallowItem) {
            shallowItem = shallow(<DimensionItem {...props} />)
        }
        return shallowItem
    }

    beforeEach(() => {
        props = {
            id: 'pe',
            name: 'Period',
            isDeactivated: false,
            isSelected: false,
            isRecommended: false,
            isLocked: false,
        }

        shallowItem = undefined
    })

    it('matches the snapshot', () => {
        expect(dimensionItem()).toMatchSnapshot()
    })

    it('matches the snapshot with recommended', () => {
        props.isRecommended = true
        expect(dimensionItem()).toMatchSnapshot()
    })

    it('matches the snapshot with selected', () => {
        props.isSelected = true
        expect(dimensionItem()).toMatchSnapshot()
    })

    it('matches the snapshot with locked', () => {
        props.isLocked = true
        expect(dimensionItem()).toMatchSnapshot()
    })

    it('matches the snapshot with onOptionsClick', () => {
        props.onOptionsClick = jest.fn()
        expect(dimensionItem()).toMatchSnapshot()
    })
})
