import { useConfig, useDataMutation, useDataEngine } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { validateExpressionMutation } from '../../../api/expression.js'
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
    const [data, setData] = useState()
    const [error, setError] = useState()
    const [loading, setLoading] = useState(true)

    const { baseUrl, apiVersion } = useConfig()

    const engine = useDataEngine()
    const [getHumanReadableExpression] = useDataMutation(
        validateExpressionMutation,
        { onError: setError }
    )

    const fetchData = useCallback(async () => {
        const { calculation } = await engine.query(calculationQuery, {
            variables: { id, displayNameProp },
            onError: setError,
        })

        if (calculation.expression) {
            const result = await getHumanReadableExpression({
                expression: calculation.expression,
            })

            if (result?.description) {
                calculation.humanReadableExpression = result.description
            }
        }

        // inject href as it is not returned from the API
        calculation.href = new URL(
            `${calculationQuery.calculation.resource}/${id}`,
            new URL(`api/${apiVersion}/`, `${baseUrl}/`)
        ).href

        setData({ calculation })
        setLoading(false)
    }, [displayNameProp, engine, getHumanReadableExpression, id])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <>
            <InfoTable data={data?.calculation} loading={loading} error={error}>
                <tr>
                    <th>{i18n.t('Expression description')}</th>
                    <td>
                        {data?.calculation.humanReadableExpression ? (
                            <span className="code">
                                {data.calculation.humanReadableExpression}
                            </span>
                        ) : (
                            <span className="none">{i18n.t('None')}</span>
                        )}
                    </td>
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
