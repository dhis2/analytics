import { shallow } from 'enzyme'
import React from 'react'
import OrgUnitDimension from '../OrgUnitDimension.js'

describe('The OrgUnitDimension component', () => {
    let props
    let shallowOrgUnitDimension

    const getWrapper = () => {
        if (!shallowOrgUnitDimension) {
            shallowOrgUnitDimension = shallow(<OrgUnitDimension {...props} />)
        }
        return shallowOrgUnitDimension
    }

    beforeEach(() => {
        props = {
            roots: [],
            selected: [],
            onSelect: jest.fn(),
            hideGroupSelect: false,
            hideLevelSelect: false,
            hideUserOrgUnits: false,
            warning: '',
        }
        shallowOrgUnitDimension = undefined
    })

    it('matches the snapshot', () => {
        const wrapper = getWrapper()
        expect(wrapper).toMatchSnapshot()
    })

    it('calls onSelect when an organisation unit is selected', () => {
        const wrapper = getWrapper()
        const orgUnitTree = wrapper.find('OrganisationUnitTree')
        const testOrgUnit = {
            id: 'testId',
            path: '/testPath',
            displayName: 'Test Org Unit',
            checked: true,
        }
        orgUnitTree.props().onChange(testOrgUnit)
        expect(props.onSelect).toHaveBeenCalledWith({
            dimensionId: 'ou',
            items: [{ id: 'testId', path: '/testPath', name: 'Test Org Unit' }],
        })
    })

    it('calls onSelect with an empty array when selection is cleared', () => {
        const wrapper = getWrapper()
        const deselectButton = wrapper.find('Button[onClick]')
        deselectButton.simulate('click')
        expect(props.onSelect).toHaveBeenCalledWith({
            dimensionId: 'ou',
            items: [],
        })
    })
})
