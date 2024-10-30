import { useDataQuery } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../../locales/index.js'
import { getCommonFields, InfoTable } from './InfoTable.js'
import styles from './styles/InfoPopover.style.js'

const calculationQuery = {
    calculation: {
        resource: 'expressionDimensionItems',
        id: ({ id }) => id,
        params: ({ displayNameProp }) => ({
            fields: `${getCommonFields(displayNameProp)},expression`,
        }),
    },
}

export const CalculationInfo = ({ id, displayNameProp }) => {
    const { loading, error, data } = useDataQuery(calculationQuery, {
        variables: { id, displayNameProp },
    })

    return (
        <>
            <InfoTable data={data?.calculation} loading={loading} error={error}>
                <tr>
                    <th>{i18n.t('Expression')}</th>
                    <td className="code">{data?.calculation.expression}</td>
                </tr>
            </InfoTable>
            <style jsx>{styles}</style>
        </>
    )
}

CalculationInfo.propTypes = {
    displayNameProp: PropTypes.string,
    id: PropTypes.string,
}
