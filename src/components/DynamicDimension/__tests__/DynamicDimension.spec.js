import React from 'react'
import { shallow } from 'enzyme'

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
            onSelect: jest.fn(),
            dimensionTitle: 'test',
            dimensionId: '123abc',
        }
        shallowSelector = undefined
    })

    it('renders an <ItemSelector>', () => {
        const itemSelector = dynamicSelector()
            .find('ItemSelector')
            .first()

        expect(itemSelector.children()).toEqual(dynamicSelector().children())
    })
})
