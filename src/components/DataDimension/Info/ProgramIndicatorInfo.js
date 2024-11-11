import { useDataMutation, useDataEngine } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { validateExpressionMutation } from '../../../api/expression.js'
import i18n from '../../../locales/index.js'
import { getCommonFields, InfoTable } from './InfoTable.js'
import styles from './styles/InfoPopover.style.js'

const programIndicatorQuery = {
    programIndicator: {
        resource: 'programIndicators',
        id: ({ id }) => id,
        params: ({ displayNameProp }) => ({
            fields: `${getCommonFields(
                displayNameProp
            )},aggregationType,analyticsPeriodBoundaries[analyticsPeriodBoundaryType,boundaryTarget,id,offsetPeriodType,offsetPeriods],analyticsType,decimals,expression,filter,legendSets[id,displayName],program[displayName]`,
        }),
    },
}

export const ProgramIndicatorInfo = ({ id, displayNameProp }) => {
    const [data, setData] = useState()
    const [error, setError] = useState()
    const [loading, setLoading] = useState(true)

    const engine = useDataEngine()
    const [getHumanReadableExpression] = useDataMutation(
        validateExpressionMutation,
        {
            onError: setError,
        }
    )

    const fetchData = useCallback(async () => {
        const { programIndicator } = await engine.query(programIndicatorQuery, {
            variables: { id, displayNameProp },
            onError: setError,
        })

        if (programIndicator.expression) {
            const result = await getHumanReadableExpression({
                expression: programIndicator.expression,
            })

            if (result?.description) {
                programIndicator.humanReadableExpression = result.description
            }
        }

        if (programIndicator.filter) {
            const result = await getHumanReadableExpression({
                expression: programIndicator.filter,
            })

            if (result?.description) {
                programIndicator.humanReadableFilter = result.description
            }
        }

        setData({ programIndicator })
        setLoading(false)
    }, [displayNameProp, engine, id, getHumanReadableExpression])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <>
            <InfoTable
                data={data?.programIndicator}
                loading={loading}
                error={error}
            >
                <tr>
                    <th>{i18n.t('Program')}</th>
                    <td>{data?.programIndicator.program.displayName}</td>
                </tr>
                <tr>
                    <th>{i18n.t('Analytics type')}</th>
                    <td>
                        {data?.programIndicator.analyticsType === 'ENROLLMENT'
                            ? i18n.t('Enrollment')
                            : i18n.t('Event')}
                    </td>
                </tr>
                <tr>
                    <th>{i18n.t('Analytics period boundaries')}</th>
                    <td>
                        <ul>
                            {data?.programIndicator.analyticsPeriodBoundaries.map(
                                ({
                                    analyticsPeriodBoundaryType,
                                    boundaryTarget,
                                    id,
                                    offsetPeriodType,
                                    offsetPeriods,
                                }) => (
                                    <li key={id}>
                                        <span>{`${i18n.t(
                                            'Type'
                                        )}: ${analyticsPeriodBoundaryType}`}</span>
                                        <span>{`${i18n.t(
                                            'Target'
                                        )}: ${boundaryTarget}`}</span>
                                        {offsetPeriods && offsetPeriodType && (
                                            <span>{`${i18n.t(
                                                'Offset'
                                            )}: ${offsetPeriodType} x ${offsetPeriods}`}</span>
                                        )}
                                    </li>
                                )
                            )}
                        </ul>
                    </td>
                </tr>
                <tr>
                    <th>{i18n.t('Expression')}</th>
                    <td>
                        {data?.programIndicator.humanReadableExpression ||
                            i18n.t('None')}
                    </td>
                </tr>
                <tr>
                    <th>{i18n.t('Filter expression')}</th>
                    <td>
                        {data?.programIndicator.humanReadableFilter ||
                            i18n.t('None')}
                    </td>
                </tr>
                <tr>
                    <th>{i18n.t('Aggregation type')}</th>
                    <td>{data?.programIndicator.aggregationType}</td>
                </tr>
                {data?.programIndicator.decimals && (
                    <tr>
                        <th>{i18n.t('Decimals in output')}</th>
                        <td>{data.programIndicator.decimals}</td>
                    </tr>
                )}
                {Boolean(data?.programIndicator.legendSets.length) && (
                    <tr>
                        <th>{i18n.t('Legend set(s)')}</th>
                        <td>
                            {data.programIndicator.legendSets.length === 1 ? (
                                data.programIndicator.legendSets[0].displayName
                            ) : (
                                <ul>
                                    {data.programIndicator.legendSets.map(
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

ProgramIndicatorInfo.propTypes = {
    displayNameProp: PropTypes.string,
    id: PropTypes.string,
}
