import PropTypes from 'prop-types'
import React from 'react'
import getFilterText from '../../visualizations/util/getFilterText.js'
import { usePivotTableEngine } from './PivotTableEngineContext.js'
import { PivotTableTitleRow } from './PivotTableTitleRow.js'

export const PivotTableTitleRows = ({ clippingResult, width }) => {
    const engine = usePivotTableEngine()
    console.log("engine.rawData", engine.rawData)
    return (
        <>
            {engine.options.title ? (
                <PivotTableTitleRow
                    title={engine.options.title}
                    scrollPosition={clippingResult.scrollPosition}
                    containerWidth={width}
                />
            ) : null}
            {engine.options.subtitle ? (
                <PivotTableTitleRow
                    title={engine.options.subtitle}
                    scrollPosition={clippingResult.scrollPosition}
                    containerWidth={width}
                />
            ) : null}
            {engine.visualization.filters?.length ? (
                <PivotTableTitleRow
                    title={getFilterText(
                        engine.visualization.filters,
                        engine.rawData.metaData
                    )}
                    scrollPosition={clippingResult.scrollPosition}
                    containerWidth={width}
                />
            ) : null}
        </>
    )
}

PivotTableTitleRows.propTypes = {
    clippingResult: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
}
