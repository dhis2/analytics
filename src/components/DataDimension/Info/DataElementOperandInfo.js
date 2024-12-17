import { useConfig, useDataEngine } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import i18n from '../../../locales/index.js'
import { valueTypeDisplayNames } from '../../../modules/valueTypes.js'
import {
    getCommonFields,
    renderDataSets,
    renderGroupMemberships,
    renderLegendSets,
    InfoTable,
} from './InfoTable.js'
import styles from './styles/InfoPopover.style.js'

const dataElementOperandsQuery = {
    dataElementOperands: {
        resource: 'dataElementOperands',
        params: ({ displayNameProp, id }) => ({
            filter: `id:eq:${id}`,
            fields: [
                `${getCommonFields(displayNameProp)}`,
                'categoryOptionCombo[categoryCombo[categories[displayName,id],displayName],displayName]',
                `dataElement[${getCommonFields(
                    displayNameProp
                )},aggregationType,categoryCombo[displayName,categories[id,displayName]],dataElementGroups[id,displayName],dataSetElements[dataSet[id,displayName]],legendSets[id,displayName],optionSet[displayName],valueType,zeroIsSignificant]`,
                'displayName,id',
            ],
        }),
    },
}

export const DataElementOperandInfo = ({ id, displayNameProp }) => {
    const [data, setData] = useState()
    const [error, setError] = useState()
    const [loading, setLoading] = useState(true)

    const { baseUrl, apiVersion } = useConfig()

    const engine = useDataEngine()

    const fetchData = useCallback(async () => {
        const { dataElementOperands } = await engine.query(
            dataElementOperandsQuery,
            {
                variables: { id, displayNameProp },
                onError: setError,
            }
        )

        const dataElementOperand = dataElementOperands.dataElementOperands[0]

        // copy some common fields from dataElement
        ;[
            'code',
            'created',
            'createdBy',
            'displayDescription',
            'lastUpdated',
        ].forEach(
            (key) =>
                (dataElementOperand[key] = dataElementOperand.dataElement[key])
        )

        // inject href as it is not returned from the API
        dataElementOperand.href = new URL(
            `${
                dataElementOperandsQuery.dataElementOperands.resource
            }?${new URLSearchParams({ filter: `id:eq:${id}` })}`,
            new URL(`api/${apiVersion}/`, baseUrl === '..' ? window.location.href.split('dhis-web-data-visualizer/')[0] : `${baseUrl}/`)
        ).href

        setData({ dataElementOperand })
        setLoading(false)
    }, [displayNameProp, engine, id])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <>
            <InfoTable
                data={data?.dataElementOperand}
                loading={loading}
                error={error}
            >
                <tr>
                    <th>{i18n.t('Data set(s)')}</th>
                    <td>
                        {data?.dataElementOperand.dataElement.dataSetElements &&
                            renderDataSets(
                                data.dataElementOperand.dataElement.dataSetElements.map(
                                    ({ dataSet }) => dataSet
                                )
                            )}
                    </td>
                </tr>
                <tr>
                    <th>{i18n.t('Zero is significant')}</th>
                    <td>
                        {data?.dataElementOperand.dataElement.zeroIsSignificant
                            ? i18n.t('True')
                            : i18n.t('False')}
                    </td>
                </tr>
                <tr>
                    <th>{i18n.t('Value type')}</th>
                    <td>
                        {
                            valueTypeDisplayNames[
                                data?.dataElementOperand.dataElement.valueType
                            ]
                        }
                    </td>
                </tr>
                <tr>
                    <th>{i18n.t('Aggregation type')}</th>
                    <td>
                        {data?.dataElementOperand.dataElement.aggregationType}
                    </td>
                </tr>
                <tr>
                    <th>{i18n.t('Category combo')}</th>
                    <td>
                        {data?.dataElementOperand.dataElement.categoryCombo
                            .displayName === 'default' ? (
                            <span className="none">{i18n.t('None')}</span>
                        ) : (
                            <details>
                                <summary>
                                    {
                                        data?.dataElementOperand.dataElement
                                            .categoryCombo.displayName
                                    }
                                </summary>
                                <ul>
                                    {data?.dataElementOperand.dataElement.categoryCombo.categories.map(
                                        ({ id, displayName }) => (
                                            <li key={id}>{displayName}</li>
                                        )
                                    )}
                                </ul>
                            </details>
                        )}
                    </td>
                </tr>
                {data?.dataElementOperand.dataElement.optionSet && (
                    <tr>
                        <td>{i18n.t('Option set')}</td>
                        <td>
                            {
                                data.dataElementOperand.dataElement.optionSet
                                    .displayName
                            }
                        </td>
                    </tr>
                )}
                <tr>
                    <th>{i18n.t('Group membership')}</th>
                    <td>
                        {data?.dataElementOperand.dataElement
                            .dataElementGroups &&
                            renderGroupMemberships(
                                data.dataElementOperand.dataElement
                                    .dataElementGroups
                            )}
                    </td>
                </tr>
                {Boolean(
                    data?.dataElementOperand.dataElement.legendSets.length
                ) && (
                    <tr>
                        <th>{i18n.t('Legend set(s)')}</th>
                        <td>
                            {renderLegendSets(
                                data.dataElementOperand.dataElement.legendSets
                            )}
                        </td>
                    </tr>
                )}
                <tr>
                    <th>{i18n.t('Category option name')}</th>
                    <td>
                        {
                            data?.dataElementOperand.categoryOptionCombo
                                .displayName
                        }
                    </td>
                </tr>
                <tr>
                    <th>{i18n.t('Category combo name')}</th>
                    <td>
                        {
                            data?.dataElementOperand.categoryOptionCombo
                                .categoryCombo.displayName
                        }
                    </td>
                </tr>
                <tr>
                    <th>{i18n.t('Categories name')}</th>
                    <td>
                        <ul>
                            {data?.dataElementOperand.categoryOptionCombo.categoryCombo.categories.map(
                                ({ id, displayName }) => (
                                    <li key={id}>{displayName}</li>
                                )
                            )}
                        </ul>
                    </td>
                </tr>
            </InfoTable>
            <style jsx>{styles}</style>
        </>
    )
}

DataElementOperandInfo.propTypes = {
    displayNameProp: PropTypes.string,
    id: PropTypes.string,
}
