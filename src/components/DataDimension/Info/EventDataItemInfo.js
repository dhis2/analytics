import { useDataQuery } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../../locales/index.js'
import { DIMENSION_TYPE_PROGRAM_DATA_ELEMENT } from '../../../modules/dataTypes.js'
import { getCommonFields, InfoTable } from './InfoTable.js'
import styles from './styles/InfoPopover.style.js'

const programDataElementQuery = {
    programDataElement: {
        resource: 'dataElements',
        id: ({ id }) => id,
        params: ({ displayNameProp }) => ({
            fields: `${getCommonFields(
                displayNameProp
            )},aggregationType,dimensionItemType,legendSets[id,displayName],optionsSet[displayName],valueType,zeroIsSignificant`,
        }),
    },
}

const programAttributeQuery = {
    programAttribute: {
        resource: 'trackedEntityAttributes',
        id: ({ id }) => id,
        params: ({ displayNameProp }) => ({
            fields: `${getCommonFields(
                displayNameProp
            )},aggregationType,dimensionItemType,legendSets[id,displayName],optionsSet[displayName],valueType,zeroIsSignificant`,
        }),
    },
}

export const EventDataItemInfo = ({ type, id, displayNameProp }) => {
    const { loading, error, data } = useDataQuery(
        type === DIMENSION_TYPE_PROGRAM_DATA_ELEMENT
            ? programDataElementQuery
            : programAttributeQuery,
        {
            // strip program id (if present)
            variables: { id: id.split('.').reverse()[0], displayNameProp },
        }
    )

    const renderInfoTable = (data) => (
        <>
            <InfoTable data={data} loading={loading} error={error}>
                <tr>
                    <th>{i18n.t('Type')}</th>
                    <td>
                        {data?.type === DIMENSION_TYPE_PROGRAM_DATA_ELEMENT
                            ? i18n.t('Data element')
                            : i18n.t('Tracked entity attribute')}
                    </td>
                </tr>
                <tr>
                    <th>{i18n.t('Value type')}</th>
                    <td>{data?.valueType}</td>
                </tr>
                {data?.optionSet && (
                    <tr>
                        <td>{i18n.t('Option set')}</td>
                        <td>{data.optionSet.displayName}</td>
                    </tr>
                )}
                {Boolean(data?.legendSets.length) && (
                    <tr>
                        <th>{i18n.t('Legend set(s)')}</th>
                        <td>
                            {data.legendSets.length === 1 ? (
                                data.legendSets[0].displayName
                            ) : (
                                <ul>
                                    {data.legendSets.map(
                                        ({ id, displayName }) => (
                                            <li key={id}>{displayName}</li>
                                        )
                                    )}
                                </ul>
                            )}
                        </td>
                    </tr>
                )}
            </InfoTable>
            <style jsx>{styles}</style>
        </>
    )

    return type === DIMENSION_TYPE_PROGRAM_DATA_ELEMENT
        ? renderInfoTable(data?.programDataElement)
        : renderInfoTable(data?.programAttribute)
}

EventDataItemInfo.propTypes = {
    displayNameProp: PropTypes.string,
    id: PropTypes.string,
    type: PropTypes.string,
}
