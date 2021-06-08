import { shallow } from 'enzyme'
import React from 'react'
import { DynamicDimension } from '../DynamicDimension'

describe('The Dynamic Dimension component ', () => {
    let props
    let shallowSelector

    const dynamicSelector = () => {
        if (!shallowSelector) {
            shallowSelector = shallow(<DynamicDimension {...props} />)
        }
        return shallowSelector
    }

    beforeEach(() => {
        props = {
            dimensionTitle: 'test',
            context: {},
            selectedItems: [],
            onSelect: jest.fn(),
            dimensionId: '123abc',
            displayNameProp: 'displayName',
        }
        shallowSelector = undefined
    })

    it('renders an <ItemSelector>', () => {
        const itemSelector = dynamicSelector().find('ItemSelector').first()

        expect(itemSelector.children()).toEqual(dynamicSelector().children())
    })
})
