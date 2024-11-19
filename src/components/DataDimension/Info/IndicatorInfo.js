import { useDataMutation, useDataEngine } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { validateIndicatorExpressionMutation } from '../../../api/expression.js'
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
            )},annualized,dataSets[id,displayName],decimals,denominator,displayDenominatorDescription,displayNumeratorDescription,indicatorGroups[id,displayName],indicatorType[displayName,factor],legendSets[id,displayName],numerator`,
        }),
    },
}

export const IndicatorInfo = ({ id, displayNameProp }) => {
    const [data, setData] = useState()
    const [error, setError] = useState()
    const [loading, setLoading] = useState(true)

    const engine = useDataEngine()
    const [getHumanReadableExpression] = useDataMutation(
        validateIndicatorExpressionMutation,
        { onError: setError }
    )

    const fetchData = useCallback(async () => {
        const { indicator } = await engine.query(indicatorQuery, {
            variables: { id, displayNameProp },
            onError: setError,
        })

        if (indicator.denominator) {
            const result = await getHumanReadableExpression({
                expression: indicator.denominator,
            })

            if (result?.description) {
                indicator.humanReadableDenominatorExpression =
                    result.description
            }
        }

        if (indicator.numerator) {
            const result = await getHumanReadableExpression({
                expression: indicator.numerator,
            })

            if (result?.description) {
                indicator.humanReadableNumeratorExpression = result.description
            }
        }

        setData({ indicator })
        setLoading(false)
    }, [displayNameProp, engine, getHumanReadableExpression, id])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <>
            <InfoTable data={data?.indicator} loading={loading} error={error}>
                <tr>
                    <th>{i18n.t('Numerator description')}</th>
                    <td>{data?.indicator.displayNumeratorDescription}</td>
                </tr>
                <tr>
                    <th>{i18n.t('Numerator expression')}</th>
                    <td>
                        {data?.indicator.humanReadableNumeratorExpression ? (
                            <span className="code">
                                {
                                    data.indicator
                                        .humanReadableNumeratorExpression
                                }
                            </span>
                        ) : (
                            <span className="none">{i18n.t('None')}</span>
                        )}
                    </td>
                </tr>
                <tr>
                    <th>{i18n.t('Denominator description')}</th>
                    <td>{data?.indicator.displayDenominatorDescription}</td>
                </tr>
                <tr>
                    <th>{i18n.t('Denominator expression')}</th>
                    <td>
                        {data?.indicator.humanReadableDenominatorExpression ? (
                            <span className="code">
                                {
                                    data.indicator
                                        .humanReadableDenominatorExpression
                                }
                            </span>
                        ) : (
                            <span className="none">{i18n.t('None')}</span>
                        )}
                    </td>
                </tr>
                <tr>
                    <th>{i18n.t('Annualized')}</th>
                    <td>
                        {data?.indicator.annualized
                            ? i18n.t('Yes')
                            : i18n.t('No')}
                    </td>
                </tr>
                <tr>
                    <th>{i18n.t('Indicator type')}</th>
                    <td>{`${data?.indicator.indicatorType.displayName}, ${data?.indicator.indicatorType.factor}`}</td>
                </tr>
                {data?.indicator.decimals && (
                    <tr>
                        <th>{i18n.t('Decimals in output')}</th>
                        <td>{data.indicator.decimals}</td>
                    </tr>
                )}
                {Boolean(data?.indicator.dataSets.length) && (
                    <tr>
                        <th>{i18n.t('Data set(s)')}</th>
                        <td>
                            {data.indicator.dataSets.length === 1 ? (
                                data.indicator.dataSets[0].displayName
                            ) : (
                                <div className="content-wrap">
                                    <ul>
                                        {data.indicator.dataSets.map(
                                            ({ id, displayName }) => (
                                                <li key={id}>{displayName}</li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}
                        </td>
                    </tr>
                )}
                <tr>
                    <th>{i18n.t('Group membership')}</th>
                    <td>
                        {data?.indicator.indicatorGroups.length === 1 ? (
                            data.indicator.indicatorGroups[0].displayName
                        ) : (
                            <div className="content-wrap">
                                <ul>
                                    {data?.indicator.indicatorGroups.map(
                                        ({ id, displayName }) => (
                                            <li key={id}>{displayName}</li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )}
                    </td>
                </tr>
                {Boolean(data?.indicator.legendSets.length) && (
                    <tr>
                        <th>{i18n.t('Legend set(s)')}</th>
                        <td>
                            {data.indicator.legendSets.length === 1 ? (
                                data.indicator.legendSets[0].displayName
                            ) : (
                                <div className="content-wrap">
                                    <ul>
                                        {data.indicator.legendSets.map(
                                            ({ id, displayName }) => (
                                                <li key={id}>{displayName}</li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}
                        </td>
                    </tr>
                )}
            </InfoTable>
            <style jsx>{styles}</style>
        </>
    )
}

IndicatorInfo.propTypes = {
    displayNameProp: PropTypes.string,
    id: PropTypes.string,
}
