import { useDataQuery } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../../locales/index.js'
import { getCommonFields, InfoTable } from './InfoTable.js'
import styles from './styles/InfoPopover.style.js'

const dataSetQuery = {
    dataSet: {
        resource: 'dataSets',
        id: ({ id }) => id,
        params: ({ displayNameProp }) => ({
            fields: `${getCommonFields(
                displayNameProp
            )},dataSetElements[dataElement[id,displayName]],expiryDays,indicators[id,displayName],periodType,`,
        }),
    },
}

export const DataSetInfo = ({ id, displayNameProp, type }) => {
    const { loading, error, data } = useDataQuery(dataSetQuery, {
        variables: { id, displayNameProp },
    })

    return (
        <>
            <InfoTable
                type={type}
                data={data?.dataSet}
                loading={loading}
                error={error}
            >
                <tr>
                    <th>{i18n.t('Period type')}</th>
                    <td>{data?.dataSet.periodType}</td>
                </tr>
                <tr>
                    <th>{i18n.t('Data elements')}</th>
                    <td>
                        {data?.dataSet.dataSetElements.length === 1 ? (
                            data.dataSet.dataSetElements[0].dataElement
                                .displayName
                        ) : (
                            <div className="content-wrap">
                                <ul>
                                    {data?.dataSet.dataSetElements.map(
                                        ({ dataElement }) => (
                                            <li key={dataElement.id}>
                                                {dataElement.displayName}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )}
                    </td>
                </tr>
                <tr>
                    <th>{i18n.t('Indicators')}</th>
                    <td>
                        {data?.dataSet.indicators.length === 1 ? (
                            data.dataSet.indicators[0].displayName
                        ) : data?.dataSet.indicators.length > 1 ? (
                            <div className="content-wrap">
                                <ul>
                                    {data.dataSet.indicators.map(
                                        ({ id, displayName }) => (
                                            <li key={id}>{displayName}</li>
                                        )
                                    )}
                                </ul>
                            </div>
                        ) : (
                            <span className="none">{i18n.t('None')}</span>
                        )}
                    </td>
                </tr>
                <tr>
                    <th>{i18n.t('Expiry days')}</th>
                    <td>{data?.dataSet.expiryDays}</td>
                </tr>
            </InfoTable>
            <style jsx>{styles}</style>
        </>
    )
}

DataSetInfo.propTypes = {
    displayNameProp: PropTypes.string,
    id: PropTypes.string,
    type: PropTypes.string,
}
