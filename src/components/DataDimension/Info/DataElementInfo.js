import { useDataQuery } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../../locales/index.js'
import { valueTypeDisplayNames } from '../../../modules/valueTypes.js'
import {
    getCommonFields,
    renderDataSets,
    renderLegendSets,
    renderGroupMemberships,
    InfoTable,
} from './InfoTable.js'
import styles from './styles/InfoPopover.style.js'

const dataElementQuery = {
    dataElement: {
        resource: 'dataElements',
        id: ({ id }) => id,
        params: ({ displayNameProp }) => ({
            fields: `${getCommonFields(
                displayNameProp
            )},aggregationType,categoryCombo[displayName,categories[id,displayName]],dataElementGroups[id,displayName],dataSetElements[dataSet[id,displayName]],legendSets[id,displayName],optionSet[displayName],valueType,zeroIsSignificant`,
        }),
    },
}

export const DataElementInfo = ({ id, displayNameProp, type }) => {
    const { loading, error, data } = useDataQuery(dataElementQuery, {
        variables: { id, displayNameProp },
    })

    return (
        <>
            <InfoTable
                type={type}
                data={data?.dataElement}
                loading={loading}
                error={error}
            >
                <tr>
                    <th>{i18n.t('Data set(s)')}</th>
                    <td>
                        {data?.dataElement.dataSetElements &&
                            renderDataSets(
                                data.dataElement.dataSetElements.map(
                                    ({ dataSet }) => dataSet
                                )
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
                    <td>
                        {valueTypeDisplayNames[data?.dataElement.valueType]}
                    </td>
                </tr>
                <tr>
                    <th>{i18n.t('Aggregation type')}</th>
                    <td>{data?.dataElement.aggregationType}</td>
                </tr>
                <tr>
                    <th>{i18n.t('Category combo')}</th>
                    <td>
                        {data?.dataElement.categoryCombo.displayName ===
                        'default' ? (
                            <span className="none">{i18n.t('None')}</span>
                        ) : (
                            <details>
                                <summary>
                                    {
                                        data?.dataElement.categoryCombo
                                            .displayName
                                    }
                                </summary>
                                <ul>
                                    {data?.dataElement.categoryCombo.categories.map(
                                        ({ id, displayName }) => (
                                            <li key={id}>{displayName}</li>
                                        )
                                    )}
                                </ul>
                            </details>
                        )}
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
                        {data?.dataElement.dataElementGroups &&
                            renderGroupMemberships(
                                data.dataElement.dataElementGroups
                            )}
                    </td>
                </tr>
                {Boolean(data?.dataElement.legendSets.length) && (
                    <tr>
                        <th>{i18n.t('Legend set(s)')}</th>
                        <td>{renderLegendSets(data.dataElement.legendSets)}</td>
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
    type: PropTypes.string,
}
