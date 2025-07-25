import { CustomDataProvider } from '@dhis2/app-runtime'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import OrgUnitDimension from '../OrgUnitDimension.js'

jest.mock('@dhis2-ui/organisation-unit-tree', () => {
    const lib = jest.requireActual('@dhis2-ui/organisation-unit-tree')

    return {
        ...lib,
        OrganisationUnitTree: () => <div>Org unit tree component mock</div>,
    }
})

describe('OrgUnitDimension', () => {
    const onSelect = jest.fn()

    const props = {
        roots: [],
        selected: [],
        onSelect: onSelect,
        hideGroupSelect: false,
        hideLevelSelect: false,
        hideUserOrgUnits: false,
        warning: '',
    }

    const renderOrgUnitDimension = (props) =>
        render(
            <CustomDataProvider
                data={{
                    organisationUnitLevels: {
                        organisationUnitLevels: [
                            {
                                name: 'Chiefdom',
                                level: 3,
                                id: 'tTUf91fCytl',
                                displayName: 'Chiefdom',
                            },
                            {
                                name: 'District',
                                level: 2,
                                id: 'wjP19dkFeIk',
                                displayName: 'District',
                            },
                            {
                                name: 'Facility',
                                level: 4,
                                id: 'm9lBJogzE95',
                                displayName: 'Facility',
                            },
                            {
                                name: 'National',
                                level: 1,
                                id: 'H1KlN4QIauv',
                                displayName: 'National',
                            },
                        ],
                    },
                    organisationUnitGroups: {
                        organisationUnitGroups: [
                            {
                                name: 'CHC',
                                id: 'CXw2yu5fodb',
                                displayName: 'CHC',
                            },
                            {
                                name: 'Chiefdom',
                                id: 'gzcv65VyaGq',
                                displayName: 'Chiefdom',
                            },
                            {
                                name: 'CHP',
                                id: 'uYxK4wmcPqA',
                                displayName: 'CHP',
                            },
                            {
                                name: 'Clinic',
                                id: 'RXL3lPSK8oG',
                                displayName: 'Clinic',
                            },
                            {
                                name: 'Country',
                                id: 'RpbiCJpIYEj',
                                displayName: 'Country',
                            },
                            {
                                name: 'District',
                                id: 'w1Atoz18PCL',
                                displayName: 'District',
                            },
                            {
                                name: 'Eastern Area',
                                id: 'nlX2VoouN63',
                                displayName: 'Eastern Area',
                            },
                            {
                                name: 'Hospital',
                                id: 'tDZVQ1WtwpA',
                                displayName: 'Hospital',
                            },
                            {
                                name: 'MCHP',
                                id: 'EYbopBOJWsW',
                                displayName: 'MCHP',
                            },
                            {
                                name: 'Mission',
                                id: 'w0gFTTmsUcF',
                                displayName: 'Mission',
                            },
                            {
                                name: 'NGO',
                                id: 'PVLOW4bCshG',
                                displayName: 'NGO',
                            },
                            {
                                name: 'Northern Area',
                                id: 'J40PpdN4Wkk',
                                displayName: 'Northern Area',
                            },
                            {
                                name: 'Private Clinic',
                                id: 'MAs88nJc9nL',
                                displayName: 'Private Clinic',
                            },
                            {
                                name: 'Public facilities',
                                id: 'oRVt7g429ZO',
                                displayName: 'Public facilities',
                            },
                            {
                                name: 'Rural',
                                id: 'GGghZsfu7qV',
                                displayName: 'Rural',
                            },
                            {
                                name: 'Southern Area',
                                id: 'jqBqIXoXpfy',
                                displayName: 'Southern Area',
                            },
                            {
                                name: 'Urban',
                                id: 'f25dqv3Y7Z0',
                                displayName: 'Urban',
                            },
                            {
                                name: 'Western Area',
                                id: 'b0EsAxm8Nge',
                                displayName: 'Western Area',
                            },
                        ],
                    },
                }}
            >
                <OrgUnitDimension {...props} />
            </CustomDataProvider>
        )

    beforeEach(() => onSelect.mockClear())

    test('OrgUnitDimension matches the snapshot', () => {
        const { container } = renderOrgUnitDimension(props)

        expect(container).toMatchSnapshot()
    })

    test('OrgUnitDimension calls onSelect when an organisation unit is selected', async () => {
        const user = userEvent.setup()

        renderOrgUnitDimension(props)

        await user.click(screen.getByText('User organisation unit'))

        expect(onSelect).toHaveBeenCalledWith({
            dimensionId: 'ou',
            items: [
                { id: 'USER_ORGUNIT', displayName: 'User organisation unit' },
            ],
        })
    })

    test('OrgUnitDimension calls onSelect with an empty array when selection is cleared', async () => {
        const user = userEvent.setup()

        renderOrgUnitDimension({
            ...props,
            // make some selection to enable the deselect all button
            selected: [{ id: 'USER_ORGUNIT_CHILDREN', name: 'User sub-units' }],
        })

        await user.click(
            screen.getByRole('button', {
                name: 'Deselect all',
            })
        )

        expect(onSelect).toHaveBeenLastCalledWith({
            dimensionId: 'ou',
            items: [],
        })
    })
})
