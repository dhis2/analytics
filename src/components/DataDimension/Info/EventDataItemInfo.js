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
            )},valueType,aggregationType,zeroIsSignificant,legendSets[id,displayName]`,
        }),
    },
}

const programAttributeQuery = {
    programAttribute: {
        resource: 'trackedEntityAttributes',
        id: ({ id }) => id,
        params: ({ displayNameProp }) => ({
            fields: `${getCommonFields(displayNameProp)}`,
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

    const renderProgramDataElementInfo = () => (
        <>
            <InfoTable
                data={data?.programDataElement}
                loading={loading}
                error={error}
            >
                <tr>
                    <th>{i18n.t('Value type')}</th>
                    <td>{data?.programDataElement.valueType}</td>
                </tr>
                <tr>
                    <th>{i18n.t('Aggregation type')}</th>
                    <td>{data?.programDataElement.aggregationType}</td>
                </tr>
                <tr>
                    <th>{i18n.t('Legend sets')}</th>
                    <td>
                        <ul>
                            {data?.programDataElement.legendSets.map(
                                ({ id, displayName }) => (
                                    <li key={id}>{displayName}</li>
                                )
                            )}
                        </ul>
                    </td>
                </tr>
                <tr>
                    <th>{i18n.t('Zero is significant')}</th>
                    <td>
                        {data?.programDataElement.zeroIsSignificant
                            ? i18n.t('True')
                            : i18n.t('False')}
                    </td>
                </tr>
            </InfoTable>
            <style jsx>{styles}</style>
        </>
    )

    const renderProgramAttributeInfo = () => (
        <>
            <InfoTable
                data={data?.programAttribute}
                loading={loading}
                error={error}
            ></InfoTable>
            <style jsx>{styles}</style>
        </>
    )

    return type === DIMENSION_TYPE_PROGRAM_DATA_ELEMENT
        ? renderProgramDataElementInfo()
        : renderProgramAttributeInfo()
}

EventDataItemInfo.propTypes = {
    displayNameProp: PropTypes.string,
    id: PropTypes.string,
    type: PropTypes.string,
}
