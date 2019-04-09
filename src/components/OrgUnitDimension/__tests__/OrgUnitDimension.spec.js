import React from 'react'
import { shallow } from 'enzyme'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import CircularProgress from '@material-ui/core/CircularProgress'

import OrgUnitDimension, { defaultState } from '../OrgUnitDimension'

jest.mock('@dhis2/d2-ui-org-unit-dialog', () => {
    return {
        OrgUnitSelector: () => (
            <div id="mockOrgUnitSelector"> mockOrgUnitSelector</div>
        ),
        userOrgUnits: [
            {
                displayName: 'User organisation unit',
                id: 'USER_ORGUNIT',
            },
            {
                displayName: 'User sub-units',
                id: 'USER_ORGUNIT_CHILDREN',
            },
            {
                displayName: 'User sub-x2-units',
                id: 'USER_ORGUNIT_GRANDCHILDREN',
            },
        ],
        removeOrgUnitLastPathSegment: () => null,
    }
})

jest.mock('../../../api/organisationUnits', () => {
    return {
        apiFetchOrganisationUnitGroups: () =>
            Promise.resolve([
                { displayName: 'CHC', id: 'CXw2yu5fodb', name: 'CHC' },
                {
                    displayName: 'Chiefdom',
                    id: 'gzcv65VyaGq',
                    name: 'Chiefdom',
                },
            ]),
        apiFetchOrganisationUnitLevels: () =>
            Promise.resolve([
                {
                    displayName: 'National',
                    id: 'H1KlN4QIauv',
                    level: 1,
                    name: 'National',
                },
                {
                    displayName: 'District',
                    id: 'wjP19dkFeIk',
                    level: 2,
                    name: 'District',
                },
            ]),
        apiFetchOrganisationUnits: () =>
            Promise.resolve({
                toArray: () => {
                    return [
                        {
                            id: 'jen',
                        },
                    ]
                },
            }),
    }
})

describe('The OrgUnitDimension component ', () => {
    let props
    let shallowDataDim

    const orgUnitDimension = () => {
        if (!shallowDataDim) {
            shallowDataDim = shallow(<OrgUnitDimension {...props} />)
        }
        return shallowDataDim
    }

    beforeEach(() => {
        props = {
            d2: {},
            ouItems: [],
            parentGraphMap: {},
            metadata: {},
            acAddUiItems: jest.fn(),
            acRemoveUiItems: jest.fn(),
            acAddParentGraphMap: jest.fn(),
            acAddMetadata: jest.fn(),
            acSetUiItems: jest.fn(),
            acSetCurrentFromUi: jest.fn(),
            current: { id: null },
            displayNameProperty: 'displayName',
        }
        shallowDataDim = undefined
    })

    it('has default state', () => {
        const actualState = orgUnitDimension().state()

        expect(actualState).toEqual(defaultState)
    })

    it('renders a DialogTitle and DialogContent component ', () => {
        const component = orgUnitDimension()

        expect(component.find(DialogTitle).first().length).toEqual(1)
        expect(component.find(DialogContent).first().length).toEqual(1)
    })
})
