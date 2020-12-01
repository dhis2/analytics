import React from 'react'
import { shallow } from 'enzyme'
import { DataDimension } from '../DataDimension'
import * as api from '../../../api/dimensions'

describe.only('DataDimension component ', () => {
    let props
    let shallowDataDim
    const dataDim = () => {
        if (!shallowDataDim) {
            shallowDataDim = shallow(<DataDimension {...props} />)
        }
        return shallowDataDim
    }

    beforeEach(() => {
        props = {
            d2: {},
            selectedDimensions: [],
            displayNameProp: 'string',
            onSelect: jest.fn(),
            onDeselect: jest.fn(),
            onReorder: jest.fn(),
        }
        shallowDataDim = undefined

        // eslint-disable-next-line no-import-assign
        api.apiFetchAlternatives = jest.fn().mockResolvedValue({
            dimensionItems: [
                { id: 'dimId1', name: 'dim Id1' },
                { id: 'dimId2', name: 'dim Id2' },
            ],
            nextPage: null,
        })
    })

    describe('has groups', () => {
        beforeEach(() => {
            // eslint-disable-next-line no-import-assign
            api.apiFetchGroups = jest.fn().mockResolvedValue([
                { id: 'rarity', name: 'Rarity' },
                { id: 'rainbow', name: 'Rainbow Dash' },
            ])
        })

        it('renders an ItemSelector', done => {
            const wrapper = dataDim()

            setTimeout(() => {
                expect(wrapper.find('ItemSelector').first().length).toEqual(1)
                done()
            })
        })
    })
})
