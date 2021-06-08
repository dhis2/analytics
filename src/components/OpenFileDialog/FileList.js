import { DataTableRow, DataTableCell, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { VisTypeIcon } from '../VisTypeIcon'
import { DateField } from './DateField'

export const FileList = ({ type, data, onSelect }) => (
    <>
        {data.map(visualization => (
            <DataTableRow key={visualization.id}>
                <DataTableCell onClick={() => onSelect(visualization.id)}>
                    {visualization.displayName}
                </DataTableCell>
                {type === 'visualization' && (
                    <DataTableCell>
                        <VisTypeIcon
                            type={visualization.type}
                            size={16}
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
    data: PropTypes.array,
    type: PropTypes.string,
    onSelect: PropTypes.func,
}

export default FileList
