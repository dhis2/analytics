// import { useDataEngine } from '@dhis2/app-runtime'
import { OrganisationUnitTree } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { DIMENSION_ID_ORGUNIT } from '../../modules/predefinedDimensions'

const OrgUnitDimension = ({ root, selected, onSelect }) => {
    // const dataEngine = useDataEngine()

    const onSelectItems = selectedItem => {
        const { id, checked, displayName, path } = selectedItem
        let result = [...selected]

        if (checked) {
            result.push({ id, path, name: displayName })
        } else {
            result = [...result.filter(item => item.id !== id)]
        }

        return onSelect({
            dimensionId: DIMENSION_ID_ORGUNIT,
            items: result,
        })
    }

    return (
        <>
            {
                // TODO: User org unit checkboxes
            }
            <OrganisationUnitTree
                roots={root}
                initiallyExpanded={[root]}
                selected={selected.map(item => item.path)}
                onChange={onSelectItems}
            />
            {
                // TODO: Groups and levels
            }
        </>
    )
}
OrgUnitDimension.propTypes = {
    root: PropTypes.string,
    selected: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            path: PropTypes.string.isRequired,
        })
    ),
    onSelect: PropTypes.func,
}

export default OrgUnitDimension
