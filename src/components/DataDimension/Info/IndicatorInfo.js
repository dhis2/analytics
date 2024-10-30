import { useDataQuery } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../../locales/index.js'
import { getCommonFields, InfoTable } from './InfoTable.js'
import styles from './styles/InfoPopover.style.js'

const indicatorQuery = {
    indicator: {
        resource: 'indicators',
        id: ({ id }) => id,
        params: ({ displayNameProp }) => ({
            fields: `${getCommonFields(
                displayNameProp
            )},indicatorType[displayName],annualized,numerator,displayNumeratorDescription,denominator,displayDenominatorDescription`,
        }),
    },
}

export const IndicatorInfo = ({ id, displayNameProp }) => {
    const { loading, error, data } = useDataQuery(indicatorQuery, {
        variables: { id, displayNameProp },
    })

    return (
        <>
            <InfoTable data={data?.indicator} loading={loading} error={error}>
                <tr>
                    <th>{i18n.t('Indicator type')}</th>
                    <td>{data?.indicator.type}</td>
                </tr>
                <tr>
                    <th>{i18n.t('Annualized')}</th>
                    <td>
                        {data?.indicator.annualized
                            ? i18n.t('True')
                            : i18n.t('False')}
                    </td>
                </tr>
                <tr>
                    <th>{i18n.t('Numerator')}</th>
                    <td>
                        {data?.indicator.numerator}: $
                        {data?.indicator.displayNumerator}
                    </td>
                </tr>
                <tr>
                    <th>{i18n.t('Denominator')}</th>
                    <td>
                        {data?.indicator.denominator}: $
                        {data?.indicator.displayDenominator}
                    </td>
                </tr>
            </InfoTable>
            <style jsx>{styles}</style>
        </>
    )
}

IndicatorInfo.propTypes = {
    displayNameProp: PropTypes.string,
    id: PropTypes.string,
}
