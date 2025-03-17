import { useDataMutation, useDataEngine } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import {
    validateProgramIndicatorExpressionMutation,
    validateProgramIndicatorFilterMutation,
} from '../../../api/expression.js'
import i18n from '../../../locales/index.js'
import {
    getCommonFields,
    renderHumanReadableExpression,
    renderLegendSets,
    sentenceCaseText,
    InfoTable,
} from './InfoTable.js'
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

export const ProgramIndicatorInfo = ({ type, id, displayNameProp }) => {
    const [data, setData] = useState()
    const [error, setError] = useState()
    const [loading, setLoading] = useState(true)

    const engine = useDataEngine()
    const [getHumanReadableExpression] = useDataMutation(
        validateProgramIndicatorExpressionMutation,
        {
            onError: setError,
        }
    )
    const [getHumanReadableFilter] = useDataMutation(
        validateProgramIndicatorFilterMutation,
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

            if (result) {
                programIndicator.humanReadableExpression = result
            }
        }

        if (programIndicator.filter) {
            const result = await getHumanReadableFilter({
                filter: programIndicator.filter,
            })

            if (result) {
                programIndicator.humanReadableFilter = result
            }
        }

        programIndicator.analyticsPeriodBoundaries.forEach(
            ({ boundaryTarget }, index) => {
                programIndicator.analyticsPeriodBoundaries[
                    index
                ].boundaryTarget = [
                    'ENROLLMENT_DATE',
                    'EVENT_DATE',
                    'INCIDENT_DATE',
                ].includes(boundaryTarget)
                    ? sentenceCaseText(boundaryTarget)
                    : i18n.t('Custom')
            }
        )

        setData({ programIndicator })
        setLoading(false)
    }, [
        displayNameProp,
        engine,
        id,
        getHumanReadableExpression,
        getHumanReadableFilter,
    ])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <>
            <InfoTable
                dataType={type}
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
                        <div className="content-wrap">
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
                                            <span>
                                                <span className="label">
                                                    {i18n.t('Type:')}&nbsp;
                                                </span>
                                                {sentenceCaseText(
                                                    analyticsPeriodBoundaryType
                                                )}
                                            </span>
                                            <br />
                                            <span>
                                                <span className="label">
                                                    {i18n.t('Target:')}&nbsp;
                                                </span>
                                                {boundaryTarget}
                                            </span>
                                            {Boolean(offsetPeriods) &&
                                                Boolean(offsetPeriodType) && (
                                                    <>
                                                        <br />
                                                        <span>
                                                            <span className="label">
                                                                {i18n.t(
                                                                    'Offset:'
                                                                )}
                                                                &nbsp;
                                                            </span>
                                                            {i18n.t(
                                                                '{{ offsetPeriodType }} × {{ offsetPeriods }}',
                                                                {
                                                                    offsetPeriodType,
                                                                    offsetPeriods,
                                                                }
                                                            )}
                                                        </span>
                                                    </>
                                                )}
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th>{i18n.t('Expression')}</th>
                    <td>
                        {data?.programIndicator.humanReadableExpression ? (
                            renderHumanReadableExpression(
                                data.programIndicator.humanReadableExpression
                            )
                        ) : (
                            <span className="none">{i18n.t('None')}</span>
                        )}
                    </td>
                </tr>
                <tr>
                    <th>{i18n.t('Filter')}</th>
                    <td>
                        {data?.programIndicator.humanReadableFilter ? (
                            renderHumanReadableExpression(
                                data.programIndicator.humanReadableFilter
                            )
                        ) : (
                            <span className="none">{i18n.t('None')}</span>
                        )}
                    </td>
                </tr>
                <tr>
                    <th>{i18n.t('Aggregation type')}</th>
                    <td>{data?.programIndicator.aggregationType}</td>
                </tr>
                {data?.programIndicator && 'decimals' in data.programIndicator && (
                    <tr>
                        <th>{i18n.t('Decimals in output')}</th>
                        <td>{data.programIndicator.decimals}</td>
                    </tr>
                )}
                {Boolean(data?.programIndicator.legendSets.length) && (
                    <tr>
                        <th>{i18n.t('Legend set(s)')}</th>
                        <td>
                            {renderLegendSets(data.programIndicator.legendSets)}
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
    type: PropTypes.string,
}
