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
            )},periodType,dataSetElements[dataElement[id,displayName]]`,
        }),
    },
}

export const DataSetInfo = ({ id, displayNameProp }) => {
    const { loading, error, data } = useDataQuery(dataSetQuery, {
        variables: { id, displayNameProp },
    })

    return (
        <>
            <InfoTable data={data?.dataSet} loading={loading} error={error}>
                <tr>
                    <th>{i18n.t('Period type')}</th>
                    <td>{data?.dataSet.periodType}</td>
                </tr>
                <tr>
                    <th>{i18n.t('Data set elements')}</th>
                    <td>
                        <ul>
                            {data?.dataSet.dataSetElements.map(
                                ({ dataElement }) => (
                                    <li key={dataElement.id}>
                                        {dataElement.displayName}
                                    </li>
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

DataSetInfo.propTypes = {
    displayNameProp: PropTypes.string,
    id: PropTypes.string,
}
