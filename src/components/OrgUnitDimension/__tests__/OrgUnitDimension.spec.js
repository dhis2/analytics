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
                        organisationUnitLevels: [],
                    },
                    organisationUnitGroups: {
                        organisationUnitGroups: [],
                    },
                }}
            >
                <OrgUnitDimension {...props} />
            </CustomDataProvider>
        )

    beforeEach(() => onSelect.mockClear())

    test('OrgUnitDimension matches the snapshot', async () => {
        const { container } = renderOrgUnitDimension(props)

        // avoid the act warning due to the snapshot being taken before async code is run
        // wait for the component to be loaded, here done by testing that the OrganisationUnitTree component is loaded
        await screen.findByText('Org unit tree component mock')

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
