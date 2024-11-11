import { useDataQuery } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../../locales/index.js'
import { capitalizeWord, getCommonFields, InfoTable } from './InfoTable.js'
import styles from './styles/InfoPopover.style.js'

const dataElementQuery = {
    dataElement: {
        resource: 'dataElements',
        id: ({ id }) => id,
        params: ({ displayNameProp }) => ({
            fields: `${getCommonFields(
                displayNameProp
            )},aggregationType,categoryCombo[displayName,categories[id,displayName]],dataElementGroups[id,displayName],dataSetElements[id,displayName],legendSets[id,displayName],optionSet[displayName],valueType,zeroIsSignificant`,
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
                    <th>{i18n.t('Data set(s)')}</th>
                    <td>
                        {data?.dataElement.dataSetElements.length === 1 ? (
                            data.dataElement.dataSetElements[0].displayName
                        ) : (
                            <ul>
                                {data?.dataElement.dataSetElements.map(
                                    ({ id, displayName }) => (
                                        <li key={id}>{displayName}</li>
                                    )
                                )}
                            </ul>
                        )}
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
                <tr>
                    <th>{i18n.t('Value type')}</th>
                    <td>{capitalizeWord(data?.dataElement.valueType)}</td>
                </tr>
                <tr>
                    <th>{i18n.t('Aggregation type')}</th>
                    <td>{data?.dataElement.aggregationType}</td>
                </tr>
                <tr>
                    <th>{i18n.t('Category combo')}</th>
                    <td>
                        <details>
                            <summary>
                                {data?.dataElement.categoryCombo.displayName}
                            </summary>
                            <ul>
                                {data?.dataElement.categoryCombo.categories.map(
                                    ({ id, displayName }) => (
                                        <li key={id}>{displayName}</li>
                                    )
                                )}
                            </ul>
                        </details>
                    </td>
                </tr>
                {data?.dataElement.optionSet && (
                    <tr>
                        <td>{i18n.t('Option set')}</td>
                        <td>{data.dataElement.optionSet.displayName}</td>
                    </tr>
                )}
                <tr>
                    <th>{i18n.t('Group membership')}</th>
                    <td>
                        {data?.dataElement.dataElementGroups.length === 1 ? (
                            data.dataElement.dataElementGroups[0].displayName
                        ) : (
                            <ul>
                                {data?.dataElement.dataElementGroups.map(
                                    ({ id, displayName }) => (
                                        <li key={id}>{displayName}</li>
                                    )
                                )}
                            </ul>
                        )}
                    </td>
                </tr>
                {Boolean(data?.dataElement.legendSets.length) && (
                    <tr>
                        <th>{i18n.t('Legend set(s)')}</th>
                        <td>
                            {data.dataElement.legendSets.length === 1 ? (
                                data.dataElement.legendSets[0].displayName
                            ) : (
                                <ul>
                                    {data.dataElement.legendSets.map(
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
}

DataElementInfo.propTypes = {
    displayNameProp: PropTypes.string,
    id: PropTypes.string,
}
