import PropTypes from 'prop-types'
import React from 'react'
import getFilterText from '../../visualizations/util/getFilterText.js'
import { usePivotTableEngine } from './PivotTableEngineContext.js'
import { PivotTableTitleRow } from './PivotTableTitleRow.js'

export const PivotTableTitleRows = ({ width }) => {
    const engine = usePivotTableEngine()

    return (
        <>
            {engine.options.title ? (
                <PivotTableTitleRow
                    title={engine.options.title}
                    containerWidth={width}
                />
            ) : null}
            {engine.options.subtitle ? (
                <PivotTableTitleRow
                    title={engine.options.subtitle}
                    containerWidth={width}
                />
            ) : null}
            {engine.visualization.filters?.length ? (
                <PivotTableTitleRow
                    title={
                        engine.options.filterText ||
                        getFilterText(
                            engine.visualization.filters,
                            engine.rawData.metaData
                        )
                    }
                    containerWidth={width}
                />
            ) : null}
        </>
    )
}

PivotTableTitleRows.propTypes = {
    width: PropTypes.number.isRequired,
}
