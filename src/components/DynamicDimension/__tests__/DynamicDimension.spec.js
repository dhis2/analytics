import React from 'react'
import { shallow } from 'enzyme'

import { DynamicDimension } from '../DynamicDimension'

describe('The Period Dimension component ', () => {
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
            d2: {},
            selectedItems: [],
            onSelect: jest.fn(),
            onDeselect: jest.fn(),
            onReorder: jest.fn(),
            dialogTitle: 'test',
            dialogId: '123abc',
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
