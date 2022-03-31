import { DataTableRow, DataTableCell, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { VisTypeIcon } from '../VisTypeIcon.js'
import { DateField } from './DateField.js'

export const FileList = ({ data, onSelect, showVisTypeColumn }) => (
    <>
        {data.map((visualization) => (
            <DataTableRow key={visualization.id}>
                <DataTableCell onClick={() => onSelect(visualization.id)}>
                    {visualization.displayName}
                </DataTableCell>
                {showVisTypeColumn && (
                    <DataTableCell align="center">
                        <VisTypeIcon
                            type={visualization.type}
                            useSmall
                            color={colors.grey600}
                        />
                    </DataTableCell>
                )}
                <DataTableCell>
                    <DateField date={visualization.created} />
                </DataTableCell>
                <DataTableCell>
                    <DateField date={visualization.lastUpdated} />
                </DataTableCell>
            </DataTableRow>
        ))}
    </>
)

FileList.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            created: PropTypes.string.isRequired,
            displayName: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            lastUpdated: PropTypes.string.isRequired,
            type: PropTypes.string,
        })
    ).isRequired,
    onSelect: PropTypes.func.isRequired,
    showVisTypeColumn: PropTypes.bool,
}

export default FileList
