import { shallow } from 'enzyme'
import React from 'react'
import DimensionsPanel from '../DimensionsPanel.js'
import DimensionList from '../List/DimensionList.js'

describe('The Dimensions component ', () => {
    let shallowDimensions
    let props
    const dimensionsComponent = () => {
        if (!shallowDimensions) {
            shallowDimensions = shallow(<DimensionsPanel {...props} />)
        }
        return shallowDimensions
    }

    beforeEach(() => {
        shallowDimensions = undefined
        props = {
            dimensions: [],
        }
    })

    it('renders a div', () => {
        expect(dimensionsComponent().find('div').length).toEqual(1)
    })

    it('renders a div containing everything else', () => {
        const wrappingDiv = dimensionsComponent().find('div').first()

        expect(wrappingDiv.children()).toEqual(dimensionsComponent().children())
    })

    it('renders a DimensionList with the correct prop', () => {
        const dimensionsComp = dimensionsComponent()
        dimensionsComp.setState({ filterText: 'filteredText' })

        const filteredList = dimensionsComp.find(DimensionList).first()

        expect(filteredList.props().filterText).toEqual(
            dimensionsComp.state().filterText
        )
    })
})
