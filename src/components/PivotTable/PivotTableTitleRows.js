import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { PivotTableEngineContext } from './PivotTableEngineContext'
import { PivotTableTitleRow } from './PivotTableTitleRow'
import getFilterText from '../../visualizations/util/getFilterText'

export const PivotTableTitleRows = ({ clippingResult, width }) => {
    const engine = useContext(PivotTableEngineContext)
    return (
        <>
            {engine.options.title ? (
                <PivotTableTitleRow
                    engine={engine}
                    title={engine.options.title}
                    scrollPosition={clippingResult.scrollPosition}
                    containerWidth={width}
                />
            ) : null}
            {engine.options.subtitle ? (
                <PivotTableTitleRow
                    engine={engine}
                    title={engine.options.subtitle}
                    scrollPosition={clippingResult.scrollPosition}
                    containerWidth={width}
                />
            ) : null}
            {engine.visualization.filters?.length ? (
                <PivotTableTitleRow
                    engine={engine}
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
