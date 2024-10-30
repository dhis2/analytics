import { useDataQuery } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../../locales/index.js'
import { getCommonFields, InfoTable } from './InfoTable.js'
import styles from './styles/InfoPopover.style.js'

const dataElementQuery = {
    dataElement: {
        resource: 'dataElements',
        id: ({ id }) => id,
        params: ({ displayNameProp }) => ({
            fields: `${getCommonFields(
                displayNameProp
            )},valueType,aggregationType,zeroIsSignificant,categoryCombo[id,displayName],legendSets[id,displayName],dataElementGroups[id,displayName]`,
        }),
    },
}

export const DataElementInfo = ({ id, displayNameProp }) => {
    const { loading, error, data } = useDataQuery(dataElementQuery, {
        variables: { id, displayNameProp },
    })

    return (
        <>
            <InfoTable data={data?.dataElement} loading={loading} error={error}>
                <tr>
                    <th>{i18n.t('Value type')}</th>
                    <td>{data?.dataElement.valueType}</td>
                </tr>
                <tr>
                    <th>{i18n.t('Aggregation type')}</th>
                    <td>{data?.dataElement.aggregationType}</td>
                </tr>
                <tr>
                    <th>{i18n.t('Category combo')}</th>
                    <td>{data?.dataElement.categoryCombo.displayName}</td>
                </tr>
                <tr>
                    <th>{i18n.t('Data element groups')}</th>
                    <td>
                        <ul>
                            {data?.dataElement.dataElementGroups.map(
                                ({ id, displayName }) => (
                                    <li key={id}>{displayName}</li>
                                )
                            )}
                        </ul>
                    </td>
                </tr>
                <tr>
                    <th>{i18n.t('Legend sets')}</th>
                    <td>
                        <ul>
                            {data?.dataElement.legendSets.map(
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
                        {data?.dataElement.zeroIsSignificant
                            ? i18n.t('True')
                            : i18n.t('False')}
                    </td>
                </tr>
            </InfoTable>
            <style jsx>{styles}</style>
        </>
    )
}

DataElementInfo.propTypes = {
    displayNameProp: PropTypes.string,
    id: PropTypes.string,
}
