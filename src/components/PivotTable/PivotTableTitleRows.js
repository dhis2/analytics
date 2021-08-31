import PropTypes from 'prop-types'
import React from 'react'
import getFilterText from '../../visualizations/util/getFilterText'
import { usePivotTableEngine } from './PivotTableEngineContext'
import { PivotTableTitleRow } from './PivotTableTitleRow'

export const PivotTableTitleRows = ({ clippingResult, width }) => {
    const engine = usePivotTableEngine()
    return (
        <>
            {engine.options.title ? (
                <PivotTableTitleRow
                    title={engine.options.title}
                    scrollPosition={clippingResult.scrollPosition}
                    containerWidth={width}
                    totalWidth={
                        engine.adaptiveClippingController.columns.totalSize +
                        engine.adaptiveClippingController.columns.headerSize
                    }
                />
            ) : null}
            {engine.options.subtitle ? (
                <PivotTableTitleRow
                    title={engine.options.subtitle}
                    scrollPosition={clippingResult.scrollPosition}
                    containerWidth={width}
                    totalWidth={
                        engine.adaptiveClippingController.columns.totalSize +
                        engine.adaptiveClippingController.columns.headerSize
                    }
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
                    totalWidth={
                        engine.adaptiveClippingController.columns.totalSize +
                        engine.adaptiveClippingController.columns.headerSize
                    }
                />
            ) : null}
        </>
    )
}

PivotTableTitleRows.propTypes = {
    clippingResult: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
}
