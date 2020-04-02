import React from 'react'
import { shallow } from 'enzyme'

import OrgUnitDimension, { defaultState } from '../OrgUnitDimension'

/* eslint-disable react/display-name */
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
/* eslint-enable react/display-name */

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
            onSelect: jest.fn(),
            onDeselect: jest.fn(),
            current: { id: null },
            displayNameProperty: 'displayName',
        }
        shallowDataDim = undefined
    })

    it('has default state', () => {
        const actualState = orgUnitDimension().state()

        expect(actualState).toEqual(defaultState)
    })
})
