import React from 'react'
import { shallow } from 'enzyme'
import { InputField } from '@dhis2/ui'

import { Filter } from '../Filter'

describe('The Filter component ', () => {
    let shallowFilter
    let props
    const filterComp = () => {
        if (!shallowFilter) {
            shallowFilter = shallow(<Filter {...props} />)
        }
        return shallowFilter
    }

    beforeEach(() => {
        props = {
            placeholder: 'testplaceholder',
            text: '',
            onChange: jest.fn(),
            onClear: jest.fn(),
        }
        shallowFilter = undefined
    })

    it('renders a InputField component', () => {
        expect(filterComp().find(InputField).length).toEqual(1)
    })

    it('should call prop onClear if onChange receives text string with length < 1 (Ctrl-A  + BackSpace)', () => {
        props.text = 'anotherTestString'

        const filter = filterComp().find(InputField)

        const mockEvent = {
            value: '',
            preventDefault: jest.fn(),
        }

        filter.props().onChange(mockEvent)

        expect(props.onClear).toHaveBeenCalledTimes(1)
    })
})
